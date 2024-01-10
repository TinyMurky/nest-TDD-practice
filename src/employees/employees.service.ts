import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(role?: Role): Promise<User[]> {
    const findedUser = await this.prismaService.user.findMany({
      where: {
        role,
      },
    });

    return findedUser;
  }
}
