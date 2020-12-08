import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger: Logger = new Logger('UserRepository');
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      return await user.save();
    } catch (exception) {
      // if (exception instanceof QueryFailedError) {
      this.logger.error(`Exception occurred: ${exception.stack}`);
      if (exception.code === '23505') {
        throw new ConflictException(`Username "${username}" already exist`);
      } else {
        throw new InternalServerErrorException('Unknown exception');
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}