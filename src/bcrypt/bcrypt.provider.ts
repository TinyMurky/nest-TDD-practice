import { Provider } from '@nestjs/common';
import * as BcryptLib from 'bcrypt';

export const Bcrypt = 'lib:bcrypt';

export const bcryptProvider: Provider = {
  provide: Bcrypt,
  useValue: BcryptLib,
};
