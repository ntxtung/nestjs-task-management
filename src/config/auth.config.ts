import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
// require('dotenv').config();

dotenv.config();
export const authConfig: JwtModuleOptions = {
  secret: process.env.AUTH_SECRET || 'EU|h>n#e9wa]S>%',
  signOptions: {
    expiresIn: process.env.AUTH_EXPIRED_IN || 3600,
  },
};
