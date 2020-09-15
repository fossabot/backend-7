import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/interfaces/user.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request): Promise<AccessTokenDto> {
    return this.authService.login(req.user as LoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<User> {
    return req.user as User;
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    await this.authService.register(registerUserDto);
  }
}
