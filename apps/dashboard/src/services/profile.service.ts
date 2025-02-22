import { getCurrentUser } from 'aws-amplify/auth';

import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../../../packages/backend/amplify/data/resource';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type UserProfile = Schema['UserProfile']['type'];
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'comments' | 'actions' | 'createdAt' | 'updatedAt'>> & { id: string };
export type UserProfileCreate = Omit<UserProfile, 'id' | 'settings' | 'createdAt' | 'updatedAt'>;

export type UserRole = Schema['UserProfile']['type']['role'];
export type UserStatus = Schema['UserProfile']['type']['status'];


export const initialSettings: UserSettings = {
  notifications: true,
  theme: 'light',
  hasLogin: false,
};

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  hasLogin: false;
}

interface ListProfilesOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof UserProfile;
    direction: 'asc' | 'desc';
  };
}

class ProfileService {

  async findUserProfile(id: string): Promise<UserProfile | null> {
    return await checkedFutureResponse(client.models.UserProfile.get({ id })) as UserProfile;
  }

  async findUserProfileByNickname(nickname: string): Promise<UserProfile | null> {
    const response = client.models.UserProfile.listUserProfileByNickname({ nickname });
    const list = await checkedNotNullFutureResponse(response) as UserProfile[];
    if (list.length === 0) {
      return null;
    }
    return list[0];
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    return await checkedNotNullFutureResponse(client.models.UserProfile.get({ id })) as UserProfile;
  }

  async createUserProfile(user: UserProfileCreate): Promise<UserProfile> {
    const response = await client.models.UserProfile.create({ ...user, settings: JSON.stringify(initialSettings) });

    return checkedResponse(response) as UserProfile;
  }

  async updateUserProfile(update: UserProfileUpdate): Promise<UserProfile> {
    return await checkedFutureResponse(client.models.UserProfile.update(update)) as UserProfile;
  }

  async listProfiles(options: ListProfilesOptions = {}): Promise<{ profiles: UserProfile[]; nextToken: string | null }> {
    const response = await client.models.UserProfile.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
    });

    return { profiles: checkedResponse(response) as UserProfile[], nextToken: response.nextToken ?? null };
  }


  async getUserProfileByCognitoName(cognitoName: string): Promise<UserProfile> {
    const response = client.models.UserProfile.listUserProfileByCognitoName({ cognitoName });
    const list = await checkedNotNullFutureResponse(response) as UserProfile[];
    return list[0];
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile> {
    const response = client.models.UserProfile.listUserProfileByEmail({ email });
    const list = await checkedNotNullFutureResponse(response) as UserProfile[];
    return list[0];
  }

  // Current user profile methods 
  async getCurrentUserProfile(): Promise<UserProfile> {
    const cognitoUser = await getCurrentUser();
    return await this.getUserProfileByCognitoName(cognitoUser.username);
  }


  async getCurrentSettings(): Promise<UserSettings> {
    const user = await this.getCurrentUserProfile();
    return typeof user.settings === 'string' ? JSON.parse(user.settings) as UserSettings : initialSettings;
  }

  async updateCurrentSettings(userSettings: UserSettings): Promise<void> {
    const user = await this.getCurrentUserProfile();
    const settings = JSON.stringify(userSettings);
    await this.updateUserProfile({ id: user.id, settings });
  }

}

export const profileService = new ProfileService();

async function currentUserId(): Promise<string> {
  return (await profileService.getCurrentUserProfile()).id;
}

export { currentUserId };