import type {
  Clip,
  ClipAnalysisResponse,
  CreateClipUploadRequest,
  CreateClipUploadResponse,
  RateClipRequest,
} from '@eitacraque/shared';
import { http } from './http';

export const clipsApi = {
  createUpload: (payload: CreateClipUploadRequest) =>
    http.post<CreateClipUploadResponse>('/clips', payload).then((r) => r.data),

  finalize: (muxUploadId: string) =>
    http.post<Clip>(`/clips/${muxUploadId}/finalize`).then((r) => r.data),

  get: (id: string) => http.get<Clip>(`/clips/${id}`).then((r) => r.data),

  getAnalysis: (id: string) =>
    http.get<ClipAnalysisResponse>(`/clips/${id}/analysis`).then((r) => r.data),

  rate: (id: string, payload: RateClipRequest) =>
    http.post(`/clips/${id}/rate`, payload).then((r) => r.data),
};
