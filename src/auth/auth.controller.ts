import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
