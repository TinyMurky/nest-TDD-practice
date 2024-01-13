import { Inject, Injectable } from '@nestjs/common';
import { Bcrypt } from './bcrypt.provider';

@Injectable()
export class BcryptService {
  constructor(@Inject(Bcrypt) private bcrypt) {}

  hash(word: string, saltRound: number) {
    if (!Number.isInteger(saltRound) || saltRound <= 0) {
      throw new Error('bad saltRound');
    }

    const salt = this.bcrypt.genSaltSync(saltRound);
    const hash = this.bcrypt.hashSync(word, salt);

    return hash;
  }

  compare(word: string, hash: string) {
    return this.bcrypt.compareSync(word, hash);
  }
}
