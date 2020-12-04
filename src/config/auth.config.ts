import { JwtModuleOptions } from '@nestjs/jwt';
require('dotenv').config();

export const authConfig: JwtModuleOptions = {
  secret: process.env.SECRET || null,
  signOptions: {
    expiresIn: 3600,
  },
};
