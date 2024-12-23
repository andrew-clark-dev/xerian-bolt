import { getCurrentUser } from 'aws-amplify/auth';

import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type UserProfile = Omit<Schema['UserProfile']['type'], 'updatedAt' | 'createdAt'>;
export type UserProfileUpdate = Omit<UserProfile, 'comments' | 'actions'>;
export type UserProfileCreate = Omit<UserProfileUpdate, 'id' | 'settings' | 'username'>;

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

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async findUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const { data: user, errors } = await client.models.UserProfile.get({ id: id });

      if (errors) {
        throw this.serviceError(errors, 'findUserProfile');
      }

      return user;
    } catch (error) {
      throw this.serviceError(error, 'findUserProfile');
    }
    return null;
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await this.findUserProfile(id);
    if (!user) {
      throw new Error('UserProfile not found');
    }
    return user;
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    const cognitoUser = await getCurrentUser();
    const user = await this.findUserProfileByUsername(cognitoUser.username);
    if (!user) {
      throw new Error('UserProfile not found');
    }
    return user;
  }

  async findUserProfileByUsername(username: string): Promise<UserProfile | null> {
    try {
      const { data: user, errors } = await client.models.UserProfile.listUserProfileByUsername({
        username: username
      });

      if (errors) {
        throw this.serviceError(errors, 'findUserProfileByEmail');
      }

      return user[0];
    } catch (error) {
      throw this.serviceError(error, 'findUserProfileByEmail');
    }
  }
  async findUserProfileByEmail(email: string): Promise<UserProfile | null> {
    try {
      const { data: user, errors } = await client.models.UserProfile.listUserProfileByEmail({
        email: email
      });

      if (errors) {
        throw this.serviceError(errors, 'findUserProfileByEmail');
      }

      return user[0];
    } catch (error) {
      throw this.serviceError(error, 'findUserProfileByEmail');
    }
  }


  async createUserProfile(user: UserProfileCreate): Promise<UserProfile> {
    try {
      const { data: newUserProfile, errors } = await client.models.UserProfile.create({
        ...user,

        settings: JSON.stringify(initialSettings),
      });

      if (errors) {
        throw this.serviceError(errors, 'createUserProfile');
      }

      return newUserProfile!;
    } catch (error) {
      throw this.serviceError(error, 'createUserProfile');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {

      const { data: user, errors } = await client.models.UserProfile.update({
        id: userId,
        ...updates,
      });

      if (errors) {
        throw this.serviceError(errors, 'updateUserProfile');
      }

      return user!;
    } catch (error) {
      throw this.serviceError(error, 'updateUserProfile');
    }
  }

  async getCurrentSettings(): Promise<UserSettings> {
    const user = await this.getCurrentUserProfile();
    return typeof user.settings === 'string' ? JSON.parse(user.settings) as UserSettings : initialSettings;
  }

  async updateCurrentSettings(userSettings: UserSettings): Promise<void> {
    const user = await this.getCurrentUserProfile();
    const settings = JSON.stringify(userSettings);
    await this.updateUserProfile(user.id, { settings });
  }

}

export const profileService = new ProfileService();

