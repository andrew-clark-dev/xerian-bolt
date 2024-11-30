import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';
import type { UserDAO } from './types';

const client = generateClient<Schema>();

class UserService {
  async syncUserData(cognitoUser: {
    username: string;
    userId: string;
  }): Promise<UserDAO> {
    try {
      // First try to get existing user by ID
      let existingUser = await client.models.User.get(cognitoUser.userId);

      // If not found by ID, try by email
      if (!existingUser) {
        const usersByEmail = await client.models.User.list({
          filter: { email: { eq: cognitoUser.username } },
          limit: 1,
        });
        existingUser = usersByEmail.data[0];
      }

      const now = new Date().toISOString();

      // If user exists, just update the login time
      if (existingUser) {
        return client.models.User.update({
          ...existingUser,
          id: cognitoUser.userId, // Ensure ID matches Cognito
          lastLoginAt: now,
          updatedAt: now,
        });
      }

      // Only create a new user if no existing user was found
      const usersByUsername = await client.models.User.list({
        filter: { username: { eq: cognitoUser.username } },
        limit: 1,
      });

      if (usersByUsername.data[0]) {
        return client.models.User.update({
          ...usersByUsername.data[0],
          lastLoginAt: now,
          updatedAt: now,
        });
      }

      // Create new user as last resort
      return client.models.User.create({
        id: cognitoUser.userId,
        username: cognitoUser.username,
        email: cognitoUser.username,
        status: 'Active',
        role: ['Employee'],
        settings: {
          notifications: true,
          theme: 'light',
        },
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Error syncing user data:', error);
      throw new Error('Failed to sync user data');
    }
  }

  async getCurrentUser(): Promise<UserDAO> {
    try {
      const cognitoUser = await getCurrentUser();
      const user = await client.models.User.get(cognitoUser.userId);

      if (!user) {
        // If user not found, trigger a sync
        return this.syncUserData(cognitoUser);
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Failed to get current user');
    }
  }

  async updateUser(
    userId: string,
    updates: Partial<UserDAO>
  ): Promise<UserDAO> {
    const user = await client.models.User.get(userId);
    if (!user) throw new Error('User not found');

    return client.models.User.update({
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}

export const userService = new UserService();
