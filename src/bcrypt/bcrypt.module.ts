import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { bcryptProvider } from './bcrypt.provider';

@Module({
  providers: [BcryptService, bcryptProvider],
  exports: [bcryptProvider],
})
export class BcryptModule {}
