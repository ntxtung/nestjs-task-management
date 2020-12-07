import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();
export const authConfig: JwtModuleOptions = {
  secret: process.env.AUTH_SECRET,
  signOptions: {
    expiresIn: parseInt(process.env.AUTH_EXPIRED_IN) || 3600,
  },
};
