import type { Clip, ClipType, Position } from '../index.js';

export interface CreateClipUploadRequest {
  title: string;
  description?: string;
  clipType: ClipType;
  position?: Position;
  matchDate?: string;
  opponent?: string;
}

export interface CreateClipUploadResponse {
  clip: Clip;
  muxUploadUrl: string;
  muxUploadId: string;
}

export interface FinalizeClipRequest {
  muxUploadId: string;
}
