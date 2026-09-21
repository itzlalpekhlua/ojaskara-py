"""CLI to create/update an admin user.

Usage:
    python create_admin.py --email=you@example.com --password=your-password
(or set ADMIN_EMAIL / ADMIN_PASSWORD env vars)
"""
import argparse
import os
import sys
from datetime import datetime, timezone

import store
from security import hash_password
from store import gen_id


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", default=os.environ.get("ADMIN_EMAIL"))
    parser.add_argument("--password", default=os.environ.get("ADMIN_PASSWORD"))
    args = parser.parse_args()

    if not args.email or not args.password:
        print(
            "Usage: python create_admin.py --email=you@example.com --password=your-password\n"
            "(or set ADMIN_EMAIL / ADMIN_PASSWORD env vars)",
            file=sys.stderr,
        )
        sys.exit(1)

    if len(args.password) < 8:
        print("Password must be at least 8 characters.", file=sys.stderr)
        sys.exit(1)

    email = args.email.strip().lower()
    password_hash = hash_password(args.password)

    existing = store.admin_users.find_one(email=email)
    if existing:
        store.admin_users.update(existing["id"], {"passwordHash": password_hash})
    else:
        store.admin_users.insert(
            {
                "id": gen_id(),
                "email": email,
                "passwordHash": password_hash,
                "role": "owner",
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
        )

    print(f"Admin user ready for {email}. You can now log in at /admin/login.")


if __name__ == "__main__":
    main()
