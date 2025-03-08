import nodemailer from "nodemailer";

const sendEmails = async ({ to, subject, html }) => {
  // Sender
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_SENDER,
      pass: process.env.SENDER_PASS,
    },
  });
  
  // Receiver
  const info = await transporter.sendMail({
    from: `"Linked-In Application" <${process.env.NODE_MAILER_SENDER}>`,
    to,
    subject,
    html,
  });
  // #####This Condition Is Only Valid If The Receiver Is Only One User#####
  return info.rejected.length == 0 ? true : false;
};

export const subjects ={
    register:"Activate Account",
    resetPass:"Reset Password"
}

export default sendEmails;
