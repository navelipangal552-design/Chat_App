//Resend is an email-sending service

/*You use it to send:
welcome emails
OTP emails
notifications
transactional emails*/

// Resend is used to send welcome emails after signup.
//This file configures and exports the Resend email client with your API key so you can send emails

import { Resend } from "resend";
import { ENV } from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY); //creates a new Resend client using your API key

//sender info
export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};