import type {
  AccountType,
  Attribute,
  Category,
  ClipStatus,
  ClipType,
  Foot,
  NotificationKind,
  Position,
  ProposalStatus,
  VerificationStatus,
} from './enums.js';

export interface User {
  id: string;
  email: string;
  accountType: AccountType;
  displayName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface AthleteProfile {
  userId: string;
  position: Position | null;
  secondaryPosition: Position | null;
  dominantFoot: Foot | null;
  birthDate: string | null;
  heightCm: number | null;
  weightKg: number | null;
  category: Category | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  overallRating: number;
  nationalPercentile: number;
  scoutVisits: number;
}

export interface ScoutProfile {
  userId: string;
  organizationName: string | null;
  regions: string[];
  bio: string | null;
}

export interface ClubProfile {
  userId: string;
  legalName: string;
  cnpj: string | null;
  federation: string | null;
  categories: Category[];
  verificationStatus: VerificationStatus;
}

export interface Clip {
  id: string;
  athleteId: string;
  title: string;
  description: string | null;
  clipType: ClipType;
  position: Position | null;
  matchDate: string | null;
  opponent: string | null;
  muxAssetId: string | null;
  muxPlaybackId: string | null;
  durationSeconds: number | null;
  status: ClipStatus;
  views: number;
  likes: number;
  createdAt: string;
}

export interface AttributeScore {
  attribute: Attribute;
  score: number;
}

export interface AiAnalysis {
  id: string;
  clipId: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  attributeScores: AttributeScore[];
  overallScore: number;
  modelVersion: string;
  generatedAt: string;
}

export interface CommunityRating {
  clipId: string;
  averageScore: number;
  ratingsCount: number;
  scoutWeightedAverage: number;
}

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface Proposal {
  id: string;
  clubId: string;
  athleteId: string;
  category: Category;
  durationMonths: number;
  monthlyValueCents: number | null;
  message: string;
  status: ProposalStatus;
  expiresAt: string;
  createdAt: string;
}
