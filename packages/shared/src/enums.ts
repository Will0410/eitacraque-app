export const AccountType = {
  ATHLETE: 'ATHLETE',
  SCOUT: 'SCOUT',
  CLUB: 'CLUB',
  FAN: 'FAN',
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const Position = {
  GOALKEEPER: 'GOALKEEPER',
  RIGHT_BACK: 'RIGHT_BACK',
  LEFT_BACK: 'LEFT_BACK',
  CENTER_BACK: 'CENTER_BACK',
  DEFENSIVE_MID: 'DEFENSIVE_MID',
  CENTER_MID: 'CENTER_MID',
  ATTACKING_MID: 'ATTACKING_MID',
  RIGHT_WING: 'RIGHT_WING',
  LEFT_WING: 'LEFT_WING',
  STRIKER: 'STRIKER',
} as const;
export type Position = (typeof Position)[keyof typeof Position];

export const Foot = {
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  BOTH: 'BOTH',
} as const;
export type Foot = (typeof Foot)[keyof typeof Foot];

export const Category = {
  SUB_11: 'SUB_11',
  SUB_13: 'SUB_13',
  SUB_15: 'SUB_15',
  SUB_17: 'SUB_17',
  SUB_20: 'SUB_20',
  PROFESSIONAL: 'PROFESSIONAL',
  AMATEUR: 'AMATEUR',
} as const;
export type Category = (typeof Category)[keyof typeof Category];

export const ClipType = {
  GOAL: 'GOAL',
  DRIBBLE: 'DRIBBLE',
  PASS: 'PASS',
  DEFENSE: 'DEFENSE',
  SAVE: 'SAVE',
  ASSIST: 'ASSIST',
  FREE_KICK: 'FREE_KICK',
  GENERAL: 'GENERAL',
} as const;
export type ClipType = (typeof ClipType)[keyof typeof ClipType];

export const ClipStatus = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  ANALYZING: 'ANALYZING',
  READY: 'READY',
  FAILED: 'FAILED',
  REMOVED: 'REMOVED',
} as const;
export type ClipStatus = (typeof ClipStatus)[keyof typeof ClipStatus];

export const Attribute = {
  FINISHING: 'FINISHING',
  DRIBBLING: 'DRIBBLING',
  PASSING: 'PASSING',
  VISION: 'VISION',
  PACE: 'PACE',
  STRENGTH: 'STRENGTH',
  POSITIONING: 'POSITIONING',
  DECISION_MAKING: 'DECISION_MAKING',
} as const;
export type Attribute = (typeof Attribute)[keyof typeof Attribute];

export const FeedTab = {
  FOR_YOU: 'FOR_YOU',
  FOLLOWING: 'FOLLOWING',
  TRENDING: 'TRENDING',
} as const;
export type FeedTab = (typeof FeedTab)[keyof typeof FeedTab];

export const NotificationKind = {
  SCOUT_VISIT: 'SCOUT_VISIT',
  NEW_RATING: 'NEW_RATING',
  ACHIEVEMENT: 'ACHIEVEMENT',
  AI_ALERT: 'AI_ALERT',
  NEW_PROPOSAL: 'NEW_PROPOSAL',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  NEW_COMMENT: 'NEW_COMMENT',
  CLIP_READY: 'CLIP_READY',
} as const;
export type NotificationKind = (typeof NotificationKind)[keyof typeof NotificationKind];

export const ProposalStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  WITHDRAWN: 'WITHDRAWN',
} as const;
export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus];

export const VerificationStatus = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];
