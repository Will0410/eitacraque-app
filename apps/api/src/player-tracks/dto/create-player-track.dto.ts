import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePlayerTrackDto {
  @IsUUID()
  athleteId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  potential?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
