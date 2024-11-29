import { themeConfig } from './config';

type ThemeColor = keyof typeof themeConfig.colors;
type ThemeVariant = 'primary' | 'secondary' | 'tertiary';
type StatusVariant = keyof typeof themeConfig.colors.status;
type ComponentVariant = keyof typeof themeConfig.components;

export const theme = {
  color: (color: 'primary', variant: ThemeVariant = 'primary') => {
    const colorConfig = themeConfig.colors[color];
    if (!colorConfig || !('light' in colorConfig)) {
      return '';
    }
    return `${colorConfig.bg} ${colorConfig.text}`;
  },

  status: (variant: StatusVariant) => {
    const statusConfig = themeConfig.colors.status[variant];
    return `${statusConfig.light} ${statusConfig.dark}`;
  },

  surface: (variant: ThemeVariant = 'primary') => {
    const surfaceConfig = themeConfig.colors.surface[variant];
    return `${surfaceConfig.light} ${surfaceConfig.dark}`;
  },

  text: (variant: ThemeVariant = 'primary') => {
    const textConfig = themeConfig.colors.text[variant];
    return `${textConfig.light} ${textConfig.dark}`;
  },

  border: (variant: ThemeVariant = 'primary') => {
    const borderConfig = themeConfig.colors.border[variant];
    return `${borderConfig.light} ${borderConfig.dark}`;
  },

  divider: (variant: ThemeVariant = 'primary') => {
    const dividerConfig = themeConfig.colors.divider[variant];
    return `${dividerConfig.light} ${dividerConfig.dark}`;
  },

  component: (type: ComponentVariant, variant: string = 'primary') => {
    const component = themeConfig.components[type];
    return `${component.base} ${component.variants[variant as keyof typeof component.variants]}`;
  },
};