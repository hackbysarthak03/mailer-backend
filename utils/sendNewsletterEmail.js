import nodemailer from "nodemailer";

const sendEmail = async ({ email }) => {

  // Create transporter

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.TO_EMAIL, // sales@svayambhuorganics.com
      pass: process.env.HOSTINGER_PASS, // mailbox password from Hostinger
    },
    tls: {
      rejectUnauthorized: false, // helps bypass SSL issues temporarily
    },
  });

  // Verify connection (optional, good for debugging)
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Error:", error);
    } else {
      console.log("SMTP Server is ready to take messages:", success);
    }
  });

  // Mail options
  const mailOptions = {
    from: `"Svayambhu Organics Website" <${process.env.TO_EMAIL}>`,
    to: process.env.TO_EMAIL,  // receive in Hostinger mailbox
    replyTo: email, // sender’s email
    subject: `Request for Newsletter Subscription`,
    html: `
    <h2>Newsletter Subscription Request</h2>
    <p><b>Email:</b> ${email}</p>
    <i>Sent from Svayambhu Organics Website</i>
  `,
  };

  return transporter.sendMail(mailOptions);

};

export default sendEmail;
