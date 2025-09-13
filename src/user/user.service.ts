import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignupSchema as RegisterDto } from '../auth/dto/signup.dto';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
