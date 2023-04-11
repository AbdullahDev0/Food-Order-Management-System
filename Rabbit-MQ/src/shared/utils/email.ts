// import nodemailer from 'nodemailer';
import * as nodemailer from 'nodemailer';

export async function email(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    return 'Successful';
  } catch (error) {
    console.log(error, 'email sending failed');
    return null;
  }
}
