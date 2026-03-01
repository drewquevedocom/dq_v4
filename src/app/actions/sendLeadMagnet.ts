"use server";

import { z } from "zod";
import { Resend } from "resend";
import JesperLeadMagnetEmail from "@/emails/JesperLeadMagnetEmail";
import { optionalEnv, requireEnv } from "@/lib/env";

const emailSchema = z.string().trim().email();

const getLeadMagnetConfig = (): { url: string; attachAsFile: boolean } => {
  const configured = optionalEnv("LEAD_MAGNET_PDF_URL");
  if (configured) {
    return {
      url: configured,
      attachAsFile: true,
    };
  }

  const baseUrl = optionalEnv("APP_BASE_URL") ?? "http://localhost:3000";
  return {
    url: `${baseUrl.replace(/\/$/, "")}/lead-magnets/7-agent-framework.pdf`,
    attachAsFile: false,
  };
};

export async function sendLeadMagnet(email: string) {
  const recipientEmail = emailSchema.parse(email);
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const leadMagnet = getLeadMagnetConfig();

  const { data, error } = await resend.emails.send({
    from: requireEnv("RESEND_FROM_EMAIL"),
    to: [recipientEmail],
    subject: "Your 7-Agent Framework PDF",
    react: JesperLeadMagnetEmail({
      downloadUrl: leadMagnet.url,
      recipientEmail,
    }),
    ...(leadMagnet.attachAsFile
      ? {
          attachments: [
            {
              filename: "7-Agent-Framework.pdf",
              path: leadMagnet.url,
            },
          ],
        }
      : {}),
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    status: "SENT",
    id: data?.id ?? null,
    to: recipientEmail,
  } as const;
}
