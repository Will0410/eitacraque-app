import type { AthleteProfileResponse } from '@eitacraque/shared';
import { http } from './http';

export const usersApi = {
  getAthlete: (id: string) =>
    http.get<AthleteProfileResponse>(`/users/athletes/${id}`).then((r) => r.data),
};
