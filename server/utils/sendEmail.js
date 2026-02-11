const nodemailer = require('nodemailer');

const sendEmail = async (subject, htmlContent) =>{
    try{
        const transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            }
        );

        const mailOptions = {
            from: `"Hangman Game System" <${process.env.EMAIL_USER}>`,
            to: 'nathrajarshi25@gmail.com',
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log("Admin Notification Email Sent!");

    }
    catch(err){
        console.log("Email Service Error:", err);
        // I'm not throwing error bcz for email Error actual contribution shouldn't hault 
    }
}

module.exports = sendEmail;