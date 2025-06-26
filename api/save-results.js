const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, score } = req.body;
    const result = `Name: ${name}, Score: ${score}\n`;

    // Save results to results.txt
    const filePath = path.join(process.cwd(), 'results.txt');
    fs.appendFileSync(filePath, result);

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // Use environment variables
      },
    });

    // Send email with results.txt
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Someone answered your quiz',
      text: fileContent,
      attachments: [
        {
          filename: 'results.txt',
          path: filePath,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Results saved and emailed successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
