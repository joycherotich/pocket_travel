import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("MAIL_USER:", process.env.MAIL_USER);       // ← debug
console.log("MAIL_PASS length:", process.env.MAIL_PASS?.length); // ← debug

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendWelcomeEmail = async ({ name, email, password, role }) => {
  const info = await transporter.sendMail({
    from: `"Pocket of Paradise" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Account Has Been Created ✈️",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#b45309">Welcome, ${name}! ✈️</h2>
        <p>Your <strong>${role}</strong> account has been created on Pocket of Paradise.</p>
        <p>Here are your login credentials:</p>
        <div style="background:#fef3c7;padding:16px;border-radius:6px;margin:16px 0">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> 
            <code style="font-size:1.1em;background:#fff;padding:2px 6px;border-radius:4px">
              ${password}
            </code>
          </p>
        </div>
        <p>Please <a href="${process.env.APP_URL}/login">log in</a> and change your password immediately.</p>
        <hr/>
        <small style="color:#aaa">Pocket of Paradise Travel System</small>
      </div>
    `,
  });

  console.log("✅ Email sent:", info.messageId);
};
