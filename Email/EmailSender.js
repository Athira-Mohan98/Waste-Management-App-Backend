import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

export const sendLoginEmail = async (to, name) => {
  const mailOptions = {
    from: `"Ecoguardian App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Login Notification",
    html: `
      <h3>Hi ${name},</h3>
      <p>You just logged in to your account.</p>
      <p>If this wasn’t you, please reset your password immediately.</p>
      <br/>
      <p>Thanks,<br/>Ecoguardian Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
