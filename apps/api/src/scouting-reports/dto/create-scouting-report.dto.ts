import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Position } from '@eitacraque/shared';

export class CreateScoutingReportDto {
  @IsUUID()
  athleteId: string;

  @IsOptional()
  @IsUUID()
  analysisId?: string;

  @IsInt()
  overallScore: number;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  potential?: number;

  @IsOptional()
  @IsString()
  recommendation?: string;

  @IsOptional()
  @IsString({ each: true })
  strengths?: string[];

  @IsOptional()
  @IsString({ each: true })
  weaknesses?: string[];

  @IsString()
  summary: string;
}
