import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Cron } from '@nestjs/schedule';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('password-reset-email')
  async handleEmailEvent(data: Record<string, unknown>) {
    this.appService.passwordResetEmail(data);
  }
  @EventPattern('generate-email-pdf')
  async handlePDFEmailEvent() {
    this.appService.generateEmailPDF();
  }

  @Cron('0 50 11 * * *')
  async schedulePDFEmail() {
    this.appService.generateEmailPDF();
  }
}
