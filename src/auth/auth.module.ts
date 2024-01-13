import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

@Module({
  imports: [UsersModule, BcryptModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
