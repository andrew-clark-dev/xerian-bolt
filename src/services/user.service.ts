import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';
import { initialSettings } from './settings.service';

const client = generateClient<Schema>();

export type User = Omit<Schema['User']['type'], 'updatedAt' | 'createdAt'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'comments' | 'actions' | 'accounts' | 'items' | 'categories' | 'transactions'>>;
export type UserCreate = Partial<Omit<User, 'comments' | 'actions' | 'accounts' | 'items' | 'categories' | 'transactions'>>;

export type UserRole = Schema['User']['type']['role'];

class UserService {

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async syncUserData(cognitoUser: {
    userId: string;
    username: string;
  }): Promise<User> {
    try {
      const now = new Date().toISOString();

      // Fetch user attributes
      const userAttributes = await fetchUserAttributes();

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
      const loginSettings = { ...initialSettings, hasLogin: true };
      const newUser = await this.createUser({
        id: cognitoUser.userId,
        username: cognitoUser.username,
        email: userAttributes.email!,
        status: 'Active',
        role: 'Employee',
        settings: JSON.stringify(loginSettings),
        lastLoginAt: now,
      });

      return newUser!;

    } catch (error) {
      throw this.serviceError(error, 'syncUserData');
    }
  }

  async findUser(userId: string): Promise<User | null> {
    try {
      const { data: user, errors } = await client.models.User.get({ id: userId });

      if (errors) {
        throw this.serviceError(errors, 'findUser');
      }

      return user;
    } catch (error) {
      throw this.serviceError(error, 'findUser');
    }
    return null;
  }

  async getUser(userId?: string): Promise<User> {
    const id = userId ?? (await getCurrentUser()).userId;

    const user = await this.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findUserByName(userName: string): Promise<User | null> {
    try {
      const { data: user, errors } = await client.models.User.listUserByUsername({
        username: userName
      });

      if (errors) {
        throw this.serviceError(errors, 'findUser');
        return null
      }

      return user[0];
    } catch (error) {
      throw this.serviceError(error, 'findUser');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const { data: user, errors } = await client.models.User.listUserByEmail({
        email: email
      });

      if (errors) {
        throw this.serviceError(errors, 'findUserByEmail');
      }

      return user[0];
    } catch (error) {
      throw this.serviceError(error, 'findUserByEmail');
    }
  }

  async createUser(user: UserCreate): Promise<User> {
    try {
      if (!user.username || !user.email) {
        throw new Error('Username and email are required to create a user');
      }

      if (!user.username || !user.email) {
        throw new Error('Username and email are required to create a user');
      }

      const { data: newUser, errors } = await client.models.User.create({
        ...user,
        username: user.username!,
        email: user.email!,
        settings: user.settings ?? JSON.stringify(initialSettings),
      });

      if (errors) {
        throw this.serviceError(errors, 'createUser');
      }

      return newUser!;
    } catch (error) {
      throw this.serviceError(error, 'createUser');
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {

      const { data: user, errors } = await client.models.User.update({
        id: userId,
        ...updates,
      });

      if (errors) {
        throw this.serviceError(errors, 'updateUser');
      }

      return user!;
    } catch (error) {
      throw this.serviceError(error, 'updateUser');
    }
  }
}

export const userService = new UserService();