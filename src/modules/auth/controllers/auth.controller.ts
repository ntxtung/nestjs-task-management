import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../shared/dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { IAuthService } from '../services/auth.service.interface';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: IAuthService) {
    this.logger.verbose('AuthController initializing...');
  }

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User, @Req() req) {
    console.log('From req: ', req.user);
    console.log('From decorator: ', user);
  }
}
