import { userService } from './user.service';

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

class SettingsService {

  async getSettings(userId?: string): Promise<UserSettings> {
    const user = await userService.getUser(userId);
    return typeof user.settings === 'string' ? JSON.parse(user.settings) as UserSettings : initialSettings;
  }

  async updateSettings(userSettings: UserSettings, userId?: string): Promise<void> {
    const user = await userService.getUser(userId);
    const settings = JSON.stringify(userSettings);
    await userService.updateUser(user.id, { settings });
  }

}

export const settingsService = new SettingsService();