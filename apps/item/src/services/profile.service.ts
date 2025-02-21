import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../backend/amplify/data/resource';
import { checkedNotNullFutureResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type UserProfile = Schema['UserProfile']['type'];

class ProfileService {
  async getCurrentUserProfile(): Promise<UserProfile> {
    const { username } = await getCurrentUser();
    const response = client.models.UserProfile.listUserProfileByNickname({ nickname: username });
    const list = await checkedNotNullFutureResponse(response) as UserProfile[];
    return list[0];
  }
}

export const profileService = new ProfileService();

export async function currentUserId(): Promise<string> {
  return (await profileService.getCurrentUserProfile()).id;
}