import { apiGet } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { TeamMemberForm } from "./TeamMemberForm";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberPublished,
  reorderTeamMember,
} from "./actions";

export default async function TeamAdminPage() {
  const members = (await apiGet<TeamMember[]>("/api/team")).sort((a, b) => a.order - b.order);

  const atLimit = members.length >= 2;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Team</h1>
      <p className="mt-1 text-sm text-bone/50">
        This section is limited to two profiles — Chairman and Managing Director — each shown with a photo and a
        short message on the site.
      </p>

      {atLimit ? (
        <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-bone/50">
          Both profiles are already set. Delete one below before adding a replacement.
        </p>
      ) : (
        <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add team member</summary>
          <div className="mt-4">
            <TeamMemberForm action={createTeamMember} submitLabel="Add member" />
          </div>
        </details>
      )}

      <div className="mt-6 space-y-3">
        {members.map((member, index) => (
          <div key={member.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.image} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-bone/50">{member.role}</p>
              </div>
              <ReorderButtons
                canMoveUp={index > 0}
                canMoveDown={index < members.length - 1}
                onMoveUp={async () => {
                  "use server";
                  await reorderTeamMember(member.id, "up");
                }}
                onMoveDown={async () => {
                  "use server";
                  await reorderTeamMember(member.id, "down");
                }}
              />
              <PublishToggle
                published={member.published}
                onToggle={async (next) => {
                  "use server";
                  await toggleTeamMemberPublished(member.id, next);
                }}
              />
              <ConfirmDeleteButton
                onDelete={async () => {
                  "use server";
                  await deleteTeamMember(member.id);
                }}
              />
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
              <div className="mt-3">
                <TeamMemberForm action={updateTeamMember.bind(null, member.id)} initial={member} submitLabel="Save changes" />
              </div>
            </details>
          </div>
        ))}
        {members.length === 0 && <p className="text-sm text-bone/40">No team members yet.</p>}
      </div>
    </div>
  );
}
