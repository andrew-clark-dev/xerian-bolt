import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type User = Omit<Schema['User']['type'], 'updatedAt' | 'createdAt'>;

class UserService {
  private async handleServiceError(error: unknown, context: string): Promise<never> {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    throw new Error(`${context}: ${message}`);
  }

  async syncUserData(cognitoUser: {
    userId: string;
    username: string;
  }): Promise<User | undefined> {
    try {
      const now = new Date().toISOString();

      // Fetch user attributes
      const userAttributes = await fetchUserAttributes()
        .catch(() => this.handleServiceError(new Error('Failed to fetch user attributes'), 'syncUserData'));

      // Try to get existing user by ID
      const { data: existingUserById, errors: getErrors } = await client.models.User.get({
        id: cognitoUser.userId
      });

      if (getErrors) {
        console.error(`Problem getting User for current cognito user  in:`, getErrors);
      }

      // Update existing user if found by ID
      if (existingUserById) {
        // return existingUserById;
        const updatedUser = this.updateUser(existingUserById.id, {
          lastLoginAt: now,
        });

        return updatedUser;
      }

      // Create new user if not found
      const { data: newUser, errors: createErrors } = await client.models.User.create({
        id: cognitoUser.userId,
        username: cognitoUser.username,
        email: userAttributes.email!,
        status: 'Active',
        role: 'Employee',
        settings: JSON.stringify({
          notifications: true,
          theme: 'light',
        }),
        lastLoginAt: now,
      });

      if (createErrors) {
        this.handleServiceError(createErrors, 'syncUserData - create new user');
      }

      return newUser!;

    } catch (error) {
      this.handleServiceError(error, 'syncUserData');
    }
  }

  async findUser(userId: string): Promise<User | null> {
    try {
      const { data: user, errors } = await client.models.User.get({ id: userId });

      if (errors) {
        this.handleServiceError(errors, 'findUser');
      }

      return user;
    } catch (error) {
      this.handleServiceError(error, 'findUser');
    }
    return null;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.findUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const { data: newUser, errors } = await client.models.User.create({
        ...user,
      });

      if (errors) {
        this.handleServiceError(errors, 'createUser');
      }

      return newUser!;
    } catch (error) {
      this.handleServiceError(error, 'createUser');
    }
    throw new Error('Failed to create user');
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {

      const { data: user, errors } = await client.models.User.update({
        id: userId,
        ...updates,
      });

      if (errors) {
        this.handleServiceError(errors, 'updateUser');
      }

      return user!;
    } catch (error) {
      this.handleServiceError(error, 'updateUser');
    }
    throw new Error('Failed to update user');
  }
}

export const userService = new UserService();