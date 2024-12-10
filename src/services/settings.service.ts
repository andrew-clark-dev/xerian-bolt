import { userService } from './user.service';

export const initialSettings: UserSettings = {
  notifications: true,
  theme: 'light',
  hasLogin: false,
};

interface UserSettings {
  apiKey?: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  hasLogin: false;

}

class SettingsService {

  async getSettings(userId?: string): Promise<UserSettings> {
    const user = await userService.getUser(userId);
    return user.settings as UserSettings;
  }

  async updateSettings(settings: UserSettings, userId?: string): Promise<void> {
    const user = await userService.getUser(userId);

    await userService.updateUser(user.id, { settings });
  }

}

export const settingsService = new SettingsService();