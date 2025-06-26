const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider (e.g., Gmail, Outlook)
  auth: {
    user: 'subseu725@gmail.com', // Replace with your email
    pass: 'your-email-password', // Replace with your email password
  },
});

// Function to send email with results.txt
function sendEmailWithResults() {
  const filePath = path.join(__dirname, 'results.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read file content

  const mailOptions = {
    from: 'subseu725@gmail.com', // Replace with your email
    to: 'subseu725@gmail.com', // Replace with your email
    subject: 'Someone answered your quiz', // Email subject
    text: fileContent, // Email body contains the content of results.txt
    attachments: [
      {
        filename: 'results.txt',
        path: filePath, // Attach the results.txt file
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
