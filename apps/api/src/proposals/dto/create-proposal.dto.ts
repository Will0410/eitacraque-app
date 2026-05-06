import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Category } from '@eitacraque/shared';

export class CreateProposalDto {
  @IsUUID()
  athleteId: string;

  @IsEnum(Category)
  category: Category;

  @IsInt()
  durationMonths: number;

  @IsOptional()
  @IsInt()
  monthlyValueCents?: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  meetingCode?: string; // optional link to meeting
}

export class UpdateProposalStatusDto {
  @IsEnum(['ACCEPTED', 'REJECTED', 'WITHDRAWN'])
  status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}
