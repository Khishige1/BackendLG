import nodemailer from "nodemailer";
import express from "express";

const router = express.Router();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// Test route
router.get("/world", (req, res) => {
  res.status(200).send("hello world");
});

// Route to send email
// router.post("/send-email", (req, res) => {
//   const { email, text } = req.body;

//   const mailOptions = {
//     from: process.env.EMAIL_USER, // Use the user from your environment variables
//     to: email, // Use the email provided in the request body
//     subject: "Hariltsagch",
//     text: text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).send(`Email sent: ${info.response}`);
//   });
// });

export default router;
