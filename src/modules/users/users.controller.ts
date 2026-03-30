import { Body, Controller, Get, Post, Put, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): UserResponseDto {
    const { id, email } = req.user;
    return { id, email };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<{ message: string; data: UserResponseDto }> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; data?: UserResponseDto }> {
    return this.usersService.update(id, updateUserDto);
  }
}