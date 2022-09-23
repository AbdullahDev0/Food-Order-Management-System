// import nodemailer from 'nodemailer';
import * as nodemailer from 'nodemailer';

export async function pdf_mail() {
  const path = 'src/shared/temp/result.pdf';
  const date_ob = new Date();
  const date = date_ob.getDate();
  const month = date_ob.getMonth();
  const year = date_ob.getFullYear();

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
      to: process.env.PRINTER_MAIL,
      subject: 'Print ' + year + '-' + (month + 1) + '-' + date,
      attachments: [
        {
          filename: 'result.pdf',
          path: path,
          contentType: 'application/pdf',
        },
      ],
    });
    console.log('Email Sent!');
    return 'Successful';
  } catch (error) {
    console.log(error, 'email sending failed');
  }
}
