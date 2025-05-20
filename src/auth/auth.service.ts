import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: Mail;
  private appEmailAddress: any;
  private appEmailPassword: any;

  constructor(private readonly configService: ConfigService) {
    this.initializeZohoTransport();
  }

  private initializeZohoTransport() {
    this.appEmailAddress = this.configService.get<string>('ZOHO_EMAIL_ADRESS');
    this.appEmailPassword = this.configService.get<string>(
      'ZOHO_EMAIL_PASSWORD',
    );
    if (!this.appEmailAddress || !this.appEmailPassword) {
      this.logger.error(
        'ERRO: credentials for Zoho email are not set in the environment variables',
        'Please set ZOHO_EMAIL_ADDRESS and ZOHO_EMAIL_PASSWORD in your environment variables',
      );
      return;
    }

    this.logger.log('Initializing Zoho transport');

    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: this.appEmailAddress,
        pass: this.appEmailPassword,
      },
    });

    this.logger.log('Verifying Zoho transport');

    this.transporter.verify(async (error, sucess) => {
      if (error) {
        this.logger.error('Error verifying Zoho transport', error.stack);
      } else {
        this.logger.log(`Zoho transport verified: ${sucess}`);
      }
    });
  }

  async sendEmailToMe(message) {
    const { name, email, text, html } = message;
    const mailOptions = {
      from: `"${name} (via portfolio saraywebster.com)" <${this.appEmailAddress}>`,
      to: this.appEmailAddress,
      subject: `Novo contato do site portfolio saraywebster.com de ${name} - ${email}`,
      text: `Nova mensage do portfolio saraywebster.com de ${name} - ${email} \n\n ${text}`,
      html: `<p>Nova mensage do portfolio saraywebster.com de ${name} - ${email}</p><p>${html}</p>`,
    };

    this.logger.log('Sending email to me', mailOptions);
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Verified email', info);
      return info;
    } catch (error) {
      this.logger.error(
        `Error sending email ${this.appEmailAddress}`,
        error.stack,
      );
      throw error;
    }
  }
}
