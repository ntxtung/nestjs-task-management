import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';

export abstract class IAuthService {
  public abstract signUp(authCredentialsDto: AuthCredentialsDto): Promise<User>;

  public abstract signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken }>;
}
