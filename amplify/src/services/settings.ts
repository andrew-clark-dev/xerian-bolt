import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface UserSettings {
  apiKey?: string;
  notifications: boolean;
  theme: 'light' | 'dark';
}

class SettingsService {
  private async getCurrentUserId(): Promise<string> {
    const { userId } = await getCurrentUser();
    return userId;
  }

  async getSettings(): Promise<UserSettings> {
    const userId = await this.getCurrentUserId();
    const user = await client.models.User.get(userId);
    
    return {
      apiKey: user?.settings?.apiKey,
      notifications: user?.settings?.notifications ?? true,
      theme: user?.settings?.theme ?? 'light',
    };
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    const userId = await this.getCurrentUserId();
    const user = await client.models.User.get(userId);
    
    if (!user) throw new Error('User not found');

    await client.models.User.update({
      ...user,
      settings: {
        ...user.settings,
        ...settings,
      },
    });
  }

  async updateApiKey(apiKey: string): Promise<void> {
    await this.updateSettings({ apiKey });
  }
}

export const settingsService = new SettingsService();