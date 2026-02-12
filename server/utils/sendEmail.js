const brevo = require('@getbrevo/brevo')

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmail = async({ to, subject, htmlContent }) => {
    const sendSmptEmail = new brevo.SendSmtpEmail();

    sendSmptEmail.sender = {
        name: "Hangman Game System",
        email: process.env.SENDER_EMAIL
    };

    sendSmptEmail.to = Array.isArray(to) ? to : [{ email: to }];

    sendSmptEmail.subject = subject;
    sendSmptEmail.htmlContent = htmlContent;

    try{
        const data = await apiInstance.sendTransacEmail(sendSmptEmail);
        // console.log("Email Sent Successfully. Message ID:", data.messageId);
        console.log("Email Sent Successfully.");
        return data;
    }
    catch(err){
        console.error('Error in sendEmail function: ', err.body || err.message);
    }
}

module.exports= sendEmail;

// const nodemailer = require('nodemailer');

// const sendEmail = async (subject, htmlContent) =>{
//     try{
//         const transporter = nodemailer.createTransport(
//             {
//                 service: 'gmail',
//                 auth:{
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASS
//                 }
//             }
//         );

//         const mailOptions = {
//             from: `"Hangman Game System" <${process.env.EMAIL_USER}>`,
//             to: 'nathrajarshi25@gmail.com',
//             subject: subject,
//             html: htmlContent
//         };

//         await transporter.sendMail(mailOptions);
//         console.log("Admin Notification Email Sent!");

//     }
//     catch(err){
//         console.log("Email Service Error:", err);
//         // I'm not throwing error bcz for email Error actual contribution shouldn't hault 
//     }
// }

// module.exports = sendEmail;