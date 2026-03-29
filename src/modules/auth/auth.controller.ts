import { UseGuards, Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role?: string;
    refreshToken?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.sub);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}