import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

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
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async getUserByEmail(email: string) {
    try {
      return await this.usersService.getByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Wrong credentials provided');
      }
      throw error;
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.getUserByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }
}
