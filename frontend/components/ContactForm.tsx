"use client";

import { useState } from "react";

export function ContactForm({ whatsappPhone }: { whatsappPhone?: string | null }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-gold-700/30 p-10 text-center">
        <p className="font-display text-2xl text-gold-200">Thank you.</p>
        <p className="mt-3 text-sm text-bone/50">
          We've opened WhatsApp with your message ready — just hit send there to reach us.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const phone = String(data.get("phone") ?? "").trim();
        const message = String(data.get("message") ?? "").trim();

        const digits = (whatsappPhone ?? "").replace(/\D/g, "");
        const intlNumber = digits.startsWith("977") ? digits : `977${digits.replace(/^0/, "")}`;

        const lines = [
          "New inquiry from the website:",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          "",
          `Message: ${message}`,
        ].filter((line): line is string => line !== null);

        const text = encodeURIComponent(lines.join("\n"));
        window.open(`https://wa.me/${intlNumber}?text=${text}`, "_blank", "noopener,noreferrer");
        setSent(true);
      }}
      className="flex flex-col gap-6"
    >
      <Field label="Name" name="name" />
      <Field label="Email" name="email" type="email" />
      <Field label="Phone" name="phone" type="tel" />
      <div>
        <label className="text-[11px] uppercase tracking-widest2 text-gold-300" htmlFor="message">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-3 w-full border border-gold-700/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-gold-400"
        />
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center gap-3 border border-gold-600/60 px-8 py-3.5 text-xs uppercase tracking-widest2 text-bone transition-colors hover:border-gold-300 hover:text-gold-200"
      >
        Send Inquiry
      </button>
    </form>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-widest2 text-gold-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={name !== "phone"}
        className="mt-3 w-full border border-gold-700/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-gold-400"
      />
    </div>
  );
}
