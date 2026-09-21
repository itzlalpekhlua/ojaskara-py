import { apiGet } from "@/lib/api";
import type { SocialPost } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SocialPostForm } from "./SocialPostForm";
import {
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  toggleSocialPostPublished,
  reorderSocialPost,
} from "./actions";

export default async function SocialAdminPage() {
  const posts = (await apiGet<SocialPost[]>("/api/social-posts")).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Social</h1>
      <p className="mt-1 text-sm text-bone/50">Instagram, Facebook and TikTok posts featured on the site.</p>

      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add post</summary>
        <div className="mt-4">
          <SocialPostForm action={createSocialPost} submitLabel="Add post" />
        </div>
      </details>

      <div className="mt-6 space-y-3">
        {posts.map((post, index) => (
          <div key={post.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {post.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.thumbnail} alt="" className="h-12 w-12 rounded-md object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-md bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">{post.platform}</p>
                <p className="truncate text-xs text-bone/50">{post.caption || post.embedUrl}</p>
              </div>
              <ReorderButtons
                canMoveUp={index > 0}
                canMoveDown={index < posts.length - 1}
                onMoveUp={async () => {
                  "use server";
                  await reorderSocialPost(post.id, "up");
                }}
                onMoveDown={async () => {
                  "use server";
                  await reorderSocialPost(post.id, "down");
                }}
              />
              <PublishToggle
                published={post.published}
                onToggle={async (next) => {
                  "use server";
                  await toggleSocialPostPublished(post.id, next);
                }}
              />
              <ConfirmDeleteButton
                onDelete={async () => {
                  "use server";
                  await deleteSocialPost(post.id);
                }}
              />
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
              <div className="mt-3">
                <SocialPostForm action={updateSocialPost.bind(null, post.id)} initial={post} submitLabel="Save changes" />
              </div>
            </details>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-bone/40">No posts yet.</p>}
      </div>
    </div>
  );
}
