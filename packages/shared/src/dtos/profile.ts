import type { AthleteProfile, AttributeScore, ClubProfile, ScoutProfile, User } from '../index.js';

export interface AthleteProfileResponse {
  user: User;
  profile: AthleteProfile;
  radar: AttributeScore[];
  recentClipsCount: number;
}

export interface ScoutProfileResponse {
  user: User;
  profile: ScoutProfile;
}

export interface ClubProfileResponse {
  user: User;
  profile: ClubProfile;
}
