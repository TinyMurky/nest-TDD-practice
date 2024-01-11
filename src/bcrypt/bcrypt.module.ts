import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { Bcrypt } from './bcrypt';
import { Bcrypt } from './bcrypt';

@Module({
  providers: [BcryptService, Bcrypt],
})
export class BcryptModule {}
