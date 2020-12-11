import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../shared/interfaces/jwt-payload.interface';
import { IAuthService } from './auth.service.interface';
import { UserRepository } from '../repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  private userRepository: UserRepository;
  constructor(
    private readonly connection: Connection,
    private jwtService: JwtService,
  ) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
