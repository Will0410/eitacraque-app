import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RateClipDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
