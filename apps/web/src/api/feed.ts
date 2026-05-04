import type { FeedResponse, FeedTab } from '@eitacraque/shared';
import { http } from './http';

export const feedApi = {
  list: (tab: FeedTab, cursor?: string) =>
    http.get<FeedResponse>('/feed', { params: { tab, cursor } }).then((r) => r.data),
};
