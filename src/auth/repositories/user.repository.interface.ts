import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  public abstract signUp(authCredentialsDto: AuthCredentialsDto): Promise<User>;
  public abstract validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string>;
}
