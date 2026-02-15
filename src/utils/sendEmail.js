const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,          
      pass: process.env.GOOGLE_APP_PASSWORD, 
    },
  });

  const mailOpts = {
    from: `E-Shop <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
