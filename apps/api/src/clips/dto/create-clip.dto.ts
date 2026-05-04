import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ClipType, Position } from '@eitacraque/shared';

export class CreateClipDto {
  @IsString()
  @Length(3, 120)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsEnum(ClipType)
  clipType!: ClipType;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsOptional()
  @IsDateString()
  matchDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  opponent?: string;
}
