import { IsEmail, MinLength, MaxLength, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @MaxLength(20, { message: 'A senha não pode ultrapassar 20 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'A senha deve conter maiúscula, minúscula, número e caractere especial',
  })
  password: string;
}