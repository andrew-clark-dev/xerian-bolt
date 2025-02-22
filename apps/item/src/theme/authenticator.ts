import { Theme } from '@aws-amplify/ui-react';

export const authenticatorTheme: Theme = {
  name: 'dashboard-auth-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '{colors.blue.50}' },
          20: { value: '{colors.blue.100}' },
          40: { value: '{colors.blue.200}' },
          60: { value: '{colors.blue.300}' },
          80: { value: '{colors.blue.400}' },
          90: { value: '{colors.blue.500}' },
          100: { value: '{colors.blue.600}' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          backgroundColor: { value: 'transparent' },
        },
        container: {
          width: { value: '100%' },
          maxWidth: { value: '400px' },
          padding: { value: '2rem' },
        },
        form: {
          padding: { value: '0' },
        },
      },
      button: {
        borderRadius: { value: '0.5rem' },
        fontSize: { value: '0.875rem' },
        lineHeight: { value: '1.25rem' },
        padding: { value: '0.625rem 1.25rem' },
      },
      fieldset: {
        borderRadius: { value: '0.5rem' },
      },
      input: {
        borderRadius: { value: '0.5rem' },
      },
    },
  },
};