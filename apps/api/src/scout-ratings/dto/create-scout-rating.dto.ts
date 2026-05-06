import { IsInt, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

export class CreateScoutRatingDto {
  @IsNotEmpty()
  scoutId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsNotEmpty()
  comment?: string;
}
