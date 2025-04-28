import 'dotenv/config'
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendCode = async (to: string, code: number) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Your verify code',
    html: `<b>${code}</b>`
  })
}

export const sendWelcomeEmail = async (to: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Your verified',
    html: `Welcome`
  })
}