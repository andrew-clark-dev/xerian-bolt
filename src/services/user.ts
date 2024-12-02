import { generateClient } from 'aws-amplify/data';
import { fetchUserAttributes } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type User = Schema['User']['type'];

class UserService {

  async syncUserData(cognitoUser: {
    userId: string;
    username: string;
  }): Promise<User> {
    try {

      const now = new Date().toISOString();

      // First try to get existing user by ID
      let { data: existingUser } = await client.models.User.get({ id: cognitoUser.userId });
      const userAttributes = await fetchUserAttributes();


      // If not found by ID, try by email
      if (!existingUser) {
        const usersByEmail = await client.models.User.list({
          filter: { email: { eq: userAttributes.email } },
          limit: 1,
        });
        existingUser = usersByEmail.data[0];
      }

      // If user exists, just update the login time
      if (existingUser) {
        const { data: loggedInUser, errors } = await client.models.User.update({
          ...existingUser,
          id: cognitoUser.userId,
          lastLoginAt: now,
        });
        if (errors) {
          console.error('Error updating user:', errors);
          throw new Error('Failed to update user');
        }
        return loggedInUser!;
      }

      const { data: createdUser, errors } = await client.models.User.create({
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
      if (errors) {
        console.error('Error updating user:', errors);
        throw new Error('Failed to update user');
      }
      return createdUser!;

    } catch (error) {
      console.error('Error syncing user data:', error);
      throw new Error('Failed to sync user data');
    }
  }

  // async getCurrentUser(): Promise<User> {
  //   try {
  //     const cognitoUser = await getCurrentUser();
  //     const userAttributes = await fetchUserAttributes();

  //       // If user not found, trigger a sync
  //       return this.syncUserData(cognitoUser.userId, cognitoUser.username, userAttributes.email);
  //   } catch (error) {
  //     console.error('Error getting current user:', error);
  //     throw new Error('Failed to get current user');
  //   }
  // }

  async findUser(
    userId: string
  ): Promise<User | null> {
    const { data: user, errors } = await client.models.User.get({ id: userId });
    if (errors) {
      console.error('Error finding user:', errors);
      throw new Error('Failed to find user');
    }
    return user;
  }

  async getUser(
    userId: string
  ): Promise<User> {
    const user = await this.findUser(userId);
    if (!user) {
      console.error('Error getting user, not found');
      throw new Error('Failed to get user');
    }
    return user;
  }

  async createUser(
    user: Omit<User, 'id'>
  ): Promise<User> {

    const { data: newUser, errors } = await client.models.User.create({
      ...user
    });
    if (errors) {
      console.error('Error updating user:', errors);
      throw new Error('Failed to update user');
    }
    return newUser!;
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    const existingUser = this.getUser(userId);

    const { data: user, errors } = await client.models.User.update({
      ...existingUser,
      ...updates,
      id: userId,
    });
    if (errors) {
      console.error('Error updating user:', errors);
      throw new Error('Failed to update user');
    }
    return user!;
  }

}

export const userService = new UserService();
