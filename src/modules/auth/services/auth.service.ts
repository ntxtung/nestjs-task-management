import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../shared/interfaces/jwt-payload.interface';
import { IAuthService } from './auth.service.interface';
import { IUserRepository } from '../repositories/user.repository.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    // @InjectRepository(UserRepository)
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

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
