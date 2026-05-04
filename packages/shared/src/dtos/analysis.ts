import type { AiAnalysis, CommunityRating } from '../index.js';

export interface ClipAnalysisResponse {
  ai: AiAnalysis | null;
  community: CommunityRating;
}

export interface RateClipRequest {
  score: number;
  comment?: string;
}
