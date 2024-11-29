import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface UserData {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  role: string[];
  settings: Record<string, any>;
  lastLoginAt?: string;
}

class UserService {
  async syncUserData(cognitoUser: { username: string; userId: string }): Promise<UserData> {
    try {
      // First try to get existing user by ID
      let existingUser = await client.models.User.get(cognitoUser.userId);

      // If not found by ID, try by email
      if (!existingUser) {
        const usersByEmail = await client.models.User.list({
          filter: { email: { eq: cognitoUser.username } },
          limit: 1
        });
        existingUser = usersByEmail.data[0];
      }

      const now = new Date().toISOString();

      if (existingUser) {
        // Update existing user
        const updatedUser = await client.models.User.update({
          ...existingUser,
          id: cognitoUser.userId, // Ensure ID matches Cognito
          lastLoginAt: now,
          updatedAt: now
        });
        return this.mapToUserData(updatedUser);
      }

      // Create new user if doesn't exist
      const newUser = await client.models.User.create({
        id: cognitoUser.userId,
        username: cognitoUser.username,
        email: cognitoUser.username,
        status: 'Active',
        role: ['Employee'],
        settings: {
          notifications: true,
          theme: 'light'
        },
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now
      });

      return this.mapToUserData(newUser);
    } catch (error) {
      console.error('Error syncing user data:', error);
      throw new Error('Failed to sync user data');
    }
  }

  private mapToUserData(dbUser: Schema['User']['type']): UserData {
    return {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      phoneNumber: dbUser.phoneNumber || undefined,
      status: dbUser.status as UserData['status'],
      role: dbUser.role || ['Employee'],
      settings: dbUser.settings || {},
      lastLoginAt: dbUser.lastLoginAt
    };
  }

  async getCurrentUser(): Promise<UserData> {
    try {
      const cognitoUser = await getCurrentUser();
      const user = await client.models.User.get(cognitoUser.userId);
      
      if (!user) {
        // If user not found, trigger a sync
        return this.syncUserData(cognitoUser);
      }

      return this.mapToUserData(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Failed to get current user');
    }
  }

  async updateUser(userId: string, updates: Partial<UserData>): Promise<UserData> {
    const user = await client.models.User.get(userId);
    if (!user) throw new Error('User not found');

    const updatedUser = await client.models.User.update({
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return this.mapToUserData(updatedUser);
  }
}

export const userService = new UserService();