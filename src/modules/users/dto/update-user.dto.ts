import { IsEmail, IsOptional, MinLength, MaxLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @MaxLength(20, { message: 'A senha não pode ultrapassar 20 caracteres' })
  password?: string;
}