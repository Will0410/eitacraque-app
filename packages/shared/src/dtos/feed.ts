import type { Clip, FeedTab, User } from '../index.js';

export interface FeedQuery {
  tab: FeedTab;
  cursor?: string;
  limit?: number;
}

export interface FeedItem {
  clip: Clip;
  athlete: Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
  aiOverallScore: number | null;
  communityAverage: number | null;
  thumbnailUrl: string | null;
}

export interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
}
