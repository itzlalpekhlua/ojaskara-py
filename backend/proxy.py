"""Reverse proxy to the Next.js frontend. Registered last (see main.py) so it
only ever catches requests no /api/* router or the /uploads mount claimed —
i.e. actual pages and Next's own /_next/* static assets."""
import httpx
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from nextjs import FRONTEND_BASE_URL

router = APIRouter()

_client = httpx.AsyncClient(base_url=FRONTEND_BASE_URL, timeout=60.0)

# Stripped from the request we send to Next: hop-by-hop headers, plus host
# (replaced below with the browser's original Host/X-Forwarded-*, not the
# internal 127.0.0.1:PORT one — Next's Server Actions reject requests where
# the effective host doesn't match the Origin header, as a CSRF guard).
# Accept-Encoding is deliberately left alone and forwarded as-is: `next
# start` compresses responses regardless, so the only correct thing to do is
# pass the real Content-Encoding through untouched and let the browser (which
# sent that real Accept-Encoding) decode it — not strip it and risk serving
# still-compressed bytes as if they were plain text.
_REQUEST_STRIP = {"connection", "keep-alive", "transfer-encoding", "content-length", "host"}

# Stripped from Next's response before relaying to the browser: hop-by-hop
# headers, and content-length (StreamingResponse/Starlette recomputes framing).
_RESPONSE_STRIP = {"connection", "keep-alive", "transfer-encoding", "content-length"}


async def _proxy(request: Request, path: str) -> StreamingResponse:
    url = httpx.URL(path=f"/{path}", query=request.url.query.encode("utf-8"))
    body = await request.body()
    headers = [(k, v) for k, v in request.headers.raw if k.decode("latin-1").lower() not in _REQUEST_STRIP]

    original_host = request.headers.get("host", request.url.netloc)

    # Behind a TLS-terminating reverse proxy (CloudPanel/Nginx on the custom
    # domain), the hop to us is plain HTTP, so request.url.scheme says "http"
    # even though the browser is on https://. Trust the edge's own
    # X-Forwarded-Proto when it sent one, so Next builds https:// URLs and its
    # Server Action origin check compares like for like.
    forwarded_proto = request.headers.get("x-forwarded-proto", "").split(",")[0].strip() or request.url.scheme

    headers.append((b"host", original_host.encode("latin-1")))
    headers.append((b"x-forwarded-host", original_host.encode("latin-1")))
    headers.append((b"x-forwarded-proto", forwarded_proto.encode("latin-1")))

    upstream = await _client.send(
        _client.build_request(request.method, url, headers=headers, content=body),
        stream=True,
    )

    async def body_iterator():
        async for chunk in upstream.aiter_raw():
            yield chunk
        await upstream.aclose()

    response_headers = {
        k.decode("latin-1"): v.decode("latin-1")
        for k, v in upstream.headers.raw
        if k.decode("latin-1").lower() not in _RESPONSE_STRIP
    }
    return StreamingResponse(body_iterator(), status_code=upstream.status_code, headers=response_headers)


@router.api_route("/", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_root(request: Request):
    return await _proxy(request, "")


@router.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_catch_all(full_path: str, request: Request):
    return await _proxy(request, full_path)
