import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Bcrypt } from 'src/bcrypt/bcrypt.provider';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(Bcrypt) private bcript,
  ) {}

  async signIn(email: string, password: string): Promise<boolean> {
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

    return true;
  }
}
