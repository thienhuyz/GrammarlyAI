const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Wrap in an async IIFE so we can use await.

    const info = await transporter.sendMail({
        from: `"GrammarlyAI" <${process.env.EMAIL_NAME}>`,
        to: email,
        subject: subject,
        html: html, // HTML body
    });

    return info
});



module.exports = sendMail