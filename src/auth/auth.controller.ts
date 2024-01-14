import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    const loginToken = this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return loginToken;
  }
}
