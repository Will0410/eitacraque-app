import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';
import { AccountType } from '@eitacraque/shared';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Senha precisa ter ao menos 8 caracteres' })
  password!: string;

  @IsString()
  @Length(2, 80)
  displayName!: string;

  @IsEnum(AccountType)
  accountType!: AccountType;
}
