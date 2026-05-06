import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { MeetingStatus } from '@prisma/client';

export class CreateMeetingDto {
  @IsUUID()
  athleteId: string;

  @IsOptional()
  @IsUUID()
  proposalId?: string;

  @IsNotEmpty()
  @IsString()
  meetingCode: string;

  @IsNotEmpty()
  @IsString()
  scheduledFor: string; // ISO date

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMeetingStatusDto {
  @IsEnum(MeetingStatus)
  status: MeetingStatus;
}

export class ConfirmMeetingDto {
  @IsInt()
  @Min(0)
  @Max(4)
  status: number;
}
