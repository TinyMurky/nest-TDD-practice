import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Bcrypt } from 'src/bcrypt/bcrypt.provider';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(Bcrypt) private bcript,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const loginUser = await this.usersService.findOne(email);

    if (!loginUser) {
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await this.bcript.compare(
      password,
      loginUser.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: loginUser.id,
      name: loginUser.name,
      email: loginUser.email,
      role: loginUser.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
