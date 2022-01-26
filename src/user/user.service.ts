import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashString } from '../common/utils';
import { AuthDto } from '../auth/dto';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, password, firstName, lastName, role }: CreateUserDto) {
    const hashedPassword = await hashString(password);

    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    await this.prisma.profile.create({
      data: {
        userId: newUser.id,
        firstName,
        lastName,
      },
    });

    return newUser;
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async checkUserCredentials(dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });

    if (!user) {
      return false;
    }

    return await compare(password, user.password);
  }
}
