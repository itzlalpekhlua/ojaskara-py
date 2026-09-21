import { apiGet } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { updateSiteSettings } from "./actions";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

function Field({ name, label, defaultValue, textarea }: { name: string; label: string; defaultValue?: string | null; textarea?: boolean }) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue ?? ""} rows={3} className={inputClass} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue ?? ""} className={inputClass} />
      )}
    </div>
  );
}

export default async function SiteSettingsAdminPage() {
  const settings = await apiGet<SiteSettings>("/api/settings");

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Site Settings</h1>
      <p className="mt-1 text-sm text-bone/50">Contact info, taglines and social links used across the site.</p>

      <SaveForm action={updateSiteSettings} className="mt-6 space-y-8">
        <section className="grid gap-4 sm:grid-cols-2">
          <Field name="tagline" label="Tagline" defaultValue={settings?.tagline} />
          <Field name="introTitle" label="Intro title" defaultValue={settings?.introTitle} />
          <div className="sm:col-span-2">
            <Field name="introBody" label="Intro body" defaultValue={settings?.introBody} textarea />
          </div>
          <Field name="finalCtaTitle" label="Final CTA title" defaultValue={settings?.finalCtaTitle} />
          <div className="sm:col-span-2">
            <Field name="finalCtaBody" label="Final CTA body" defaultValue={settings?.finalCtaBody} textarea />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field name="phone" label="Phone" defaultValue={settings?.phone} />
          <Field name="phoneSecondary" label="Phone (secondary)" defaultValue={settings?.phoneSecondary} />
          <Field name="email" label="Email" defaultValue={settings?.email} />
          <Field name="address" label="Address" defaultValue={settings?.address} />
          <Field name="locationPrimaryName" label="Primary location name" defaultValue={settings?.locationPrimaryName} />
          <Field name="locationPrimaryLabel" label="Primary location label" defaultValue={settings?.locationPrimaryLabel} />
          <Field name="locationSecondaryName" label="Secondary location name" defaultValue={settings?.locationSecondaryName} />
          <Field name="locationSecondaryLabel" label="Secondary location label" defaultValue={settings?.locationSecondaryLabel} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field name="instagramUrl" label="Instagram URL" defaultValue={settings?.instagramUrl} />
          <Field name="facebookUrl" label="Facebook URL" defaultValue={settings?.facebookUrl} />
          <Field name="tiktokUrl" label="TikTok URL" defaultValue={settings?.tiktokUrl} />
          <Field name="whatsappUrl" label="WhatsApp URL" defaultValue={settings?.whatsappUrl} />
        </section>

        <SaveButton label="Save changes" />
      </SaveForm>
    </div>
  );
}
