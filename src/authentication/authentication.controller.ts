import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async register(@Body() signUpData: SignUpDto) {
    return this.authenticationService.signUp(signUpData);
  }

  @HttpCode(200)
  @Post('sign-in')
  async logIn(
    @Body() signInData: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user =
      await this.authenticationService.getAuthenticatedUser(signInData);
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }
}
