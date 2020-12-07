import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';

export interface AuthServiceInterface {
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<User>;
  signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken }>;
}
