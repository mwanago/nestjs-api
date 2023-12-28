import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { UsersService } from '../users/users.service';

describe('The AuthenticationService', () => {
  let userData: User;
  let authenticationService: AuthenticationService;
  let password: string;
  beforeEach(async () => {
    password = 'strongPassword123';
    const hashedPassword = await hash(password, 10);
    userData = {
      id: 1,
      email: 'john@smith.com',
      name: 'John',
      password: hashedPassword,
      addressId: null,
      phoneNumber: null,
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            getByEmail: jest.fn().mockResolvedValue(userData),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });
  describe('when the getCookieForLogOut method is called', () => {
    it('should return a correct string', () => {
      const result = authenticationService.getCookieForLogOut();
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });
  describe('when the getAuthenticatedUser method is called', () => {
    describe('and a valid email and password are provided', () => {
      it('should return the new user', async () => {
        const result = await authenticationService.getAuthenticatedUser({
          email: userData.email,
          password,
        });
        expect(result).toBe(userData);
      });
    });
  });
});
