import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { email } from './shared/utils/email';
// import { Puppeteer } from 'puppeteer';
import puppeteer from 'puppeteer';
import { pdf_mail } from './shared/utils/pdf_mail';

@Injectable()
export class AppService {
  async passwordResetEmail(data: Record<string, unknown>) {
    if (!(await email(data.user_mail, 'Reset Password', data.link)))
      throw new ServiceUnavailableException();
    console.log('Email Send Successfully!');
  }
  async generateEmailPDF() {
    try {
      const path = '../shared/temp/result.pdf';
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const website_url = 'http://localhost/sample-order/';
      await page.goto(website_url, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('screen');
      await page.pdf({
        path: path,
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
      });
      await browser.close();
    } catch (error) {
      console.log(error);
    }
    await pdf_mail();
  }
}
