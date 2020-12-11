import { Logger, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './services/jwt.strategy';
import { authConfig } from '../../config/auth.config';
import { IAuthService } from './services/auth.service.interface';

const logger = new Logger();
logger.verbose(`Auth config: ${JSON.stringify(authConfig, null, 2)}`);

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register(authConfig),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    UserRepository,
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
