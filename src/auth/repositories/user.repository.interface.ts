import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export abstract class IUserRepository extends Repository<User> {
  public abstract signUp(authCredentialsDto: AuthCredentialsDto): Promise<User>;

  public abstract validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string>;
}
