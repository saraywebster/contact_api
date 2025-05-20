import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface EmailRequestBody {
  name: string;
  email: string;
  text: string;
  html?: string;
}
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    //private readonly configService: ConfigService,
  ) {}

  @Post('send-email')
  async sendEmailToMe(@Body() body: EmailRequestBody) {
    const message = {
      name: body.name,
      email: body.email,
      text: body.text,
      html: body.html || `<p>${body.text}</p>`,
    };

    return this.authService.sendEmailToMe(message);
  }
}
