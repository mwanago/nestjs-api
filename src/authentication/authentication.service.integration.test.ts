import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';

jest.mock('bcrypt', () => ({
  hash: () => {
    return Promise.resolve('hashed-password');
  },
}));

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let prismaCreateMock: jest.Mock;
  let signUpData: SignUpDto;
  beforeEach(async () => {
    prismaCreateMock = jest.fn();
    signUpData = {
      email: 'john@smith.com',
      name: 'John',
      password: 'strongPassword123',
      phoneNumber: '123456789',
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: prismaCreateMock,
            },
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
  describe('when the signUp function is called', () => {
    it('should call the create method from the PrismaService', async () => {
      await authenticationService.signUp(signUpData);
      expect(prismaCreateMock).toBeCalledWith({
        data: {
          ...signUpData,
          address: {
            create: signUpData.address,
          },
          password: 'hashed-password',
        },
        include: {
          address: true,
        },
      });
    });
  });
});
