import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { WrongCredentialsException } from './wrong-credentials-exception';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(signUpData: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpData.password, 10);
    return this.usersService.create({
      name: signUpData.name,
      email: signUpData.email,
      password: hashedPassword,
    });
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }
  }

  private async getUserByEmail(email: string) {
    try {
      return await this.usersService.getByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new WrongCredentialsException();
      }
      throw error;
    }
  }

  public async getAuthenticatedUser(signInData: SignInDto) {
    const user = await this.getUserByEmail(signInData.email);
    await this.verifyPassword(signInData.password, user.password);
    return user;
  }
}
