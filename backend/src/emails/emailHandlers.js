//sends a welcome email to a new user after signup using the Resend Email API.
//When someone signs up → this function creates an email → sends it → logs success or error.

import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js";

//this function takes (receiver's email , user's full name )
export const sendWelcomeEmail = async (email, name, clientURL) => {
  
  const { data, error } = await resendClient.emails.send({ //Send the email using Resend
    from: `${sender.name} <${sender.email}>`, //sender name and email
    to: email, //user's email address
    subject: "Welcome to Chatify!", //email subject 
    html: createWelcomeEmailTemplate(name, clientURL), //email contents 
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};