import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findOne(email: string): Promise<User | null> {
    const findedUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return findedUser;
  }
}
