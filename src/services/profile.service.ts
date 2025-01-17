import { getCurrentUser } from 'aws-amplify/auth';

import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../amplify/data/resource';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type UserProfile = Schema['UserProfile']['type'];
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'comments' | 'actions' | 'createdAt' | 'updatedAt'>> & { id: string };
export type UserProfileCreate = Omit<UserProfile, 'id' | 'settings' | 'createdAt' | 'updatedAt'>;

export type UserRole = Schema['UserProfile']['type']['role'];
export type UserStatus = Schema['UserProfile']['type']['status'];


export const initialSettings: UserSettings = {
  apiKey: undefined,
  notifications: true,
  theme: 'light',
  hasLogin: false,
};

export interface UserSettings {
  apiKey?: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  hasLogin: false;
}


class ProfileService {

  async findUserProfile(id: string): Promise<UserProfile | null> {
    return await checkedFutureResponse(client.models.UserProfile.get({ id })) as UserProfile;
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

  async getCurrentUserProfile(): Promise<UserProfile> {
    const cognitoUser = await getCurrentUser();
    return await this.getUserProfileByCognitoName(cognitoUser.username);
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