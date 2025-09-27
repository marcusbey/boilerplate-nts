import { Resend } from "resend";
import { env } from "../env";
import type { MailAdapter } from "./send-email";

export const resend = new Resend(env.RESEND_API_KEY);

export const resendMailAdapter: MailAdapter = {
  send: async (params) => {
    const result = await resend.emails.send(params);

    if (result.error) {
      return { error: new Error(result.error.message), data: null };
    }

    return { error: null, data: { id: result.data.id } };
  },
};
