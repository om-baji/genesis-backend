import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { SignupSchema } from './dto/signup.dto';

jest.mock('src/utils/password', () => ({
  hashPassword: jest.fn(() => Promise.resolve('hashed-password')),
}));

// describe('AuthService', () => {
//   let service: AuthService;
//   let prisma: jest.Mocked<PrismaService>;
//   let jwt: jest.Mocked<JwtService>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: PrismaService,
//           useValue: {
//             user: {
//               findUnique: jest.fn(),
//               create: jest.fn(),
//               update: jest.fn(),
//             },
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             signAsync: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     prisma = module.get(PrismaService);
//     jwt = module.get(JwtService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('registerUser', () => {
//     const payload: SignupSchema = {
//       email: 'test@example.com',
//       name: 'Test User',
//       password: 'password123',
//     };

//     it('should throw if user already exists', async () => {
//       await prisma.user.findUnique.mockResolvedValue({ id: 'abc123' } as any);

//       await expect(service.registerUser(payload)).rejects.toThrow(
//         ConflictException,
//       );
//     });

//     it('should create user and return tokens if not exists', async () => {
//       prisma.user.findUnique.mockResolvedValue(null);
//       prisma.user.create.mockResolvedValue({
//         id: 'user-id',
//         email: payload.email,
//         name: payload.name,
//       } as any);
//       jwt.signAsync.mockResolvedValue('mocked-jwt-token');

//       const result = await service.registerUser(payload);

//       expect(prisma.user.findUnique).toHaveBeenCalledWith({
//         where: { email: payload.email },
//       });

//       expect(prisma.user.create).toHaveBeenCalledWith({
//         data: {
//           email: payload.email,
//           name: payload.name,
//           password: 'hashed-password',
//         },
//       });

//       expect(jwt.signAsync).toHaveBeenCalledTimes(2);
//       expect(result).toEqual({
//         accessToken: 'mocked-jwt-token',
//         refreshToken: 'mocked-jwt-token',
//       });
//     });
//   });
// });
