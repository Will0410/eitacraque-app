import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ReactionTypeEnum {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  HELPFUL = 'HELPFUL',
  NOT_HELPFUL = 'NOT_HELPFUL',
}

export class CreateReactionDto {
  @IsEnum(ReactionTypeEnum)
  @IsNotEmpty()
  type: ReactionTypeEnum;

  @IsString()
  @IsNotEmpty()
  analysisId: string;
}
