import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): { message: string; data: UserResponseDto } {
    const newUser: User = { id: Date.now(), ...createUserDto };
    this.users.push(newUser);
    return { message: 'Usuário criado com sucesso', data: { id: newUser.id, email: newUser.email } };
  }

  update(id: string, updateUserDto: UpdateUserDto): { message: string; data?: UserResponseDto } {
    const userIndex = this.users.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      return { message: 'Usuário não encontrado' };
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    const updated = this.users[userIndex];
    return { message: 'Usuário atualizado com sucesso', data: { id: updated.id, email: updated.email } };
  }
}