export const themeConfig = {
  colors: {
    primary: {
      light: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-600 hover:text-white',
        border: 'border-blue-200',
        ring: 'ring-blue-500',
      },
      dark: {
        bg: 'dark:bg-blue-900',
        text: 'dark:text-blue-400',
        hover: 'dark:hover:bg-blue-500 dark:hover:text-white',
        border: 'dark:border-blue-800',
        ring: 'dark:ring-blue-400',
      },
    },
    secondary: {
      light: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        hover: 'hover:bg-gray-200 hover:text-gray-900',
        border: 'border-gray-200',
        ring: 'ring-gray-400',
      },
      dark: {
        bg: 'dark:bg-gray-800',
        text: 'dark:text-gray-300',
        hover: 'dark:hover:bg-gray-700 dark:hover:text-white',
        border: 'dark:border-gray-700',
        ring: 'dark:ring-gray-500',
      },
    },
    tertiary: {
      light: {
        bg: 'bg-gray-50',
        text: 'text-gray-500',
        hover: 'hover:bg-gray-100 hover:text-gray-700',
        border: 'border-gray-100',
        ring: 'ring-gray-300',
      },
      dark: {
        bg: 'dark:bg-gray-700',
        text: 'dark:text-gray-400',
        hover: 'dark:hover:bg-gray-600 dark:hover:text-gray-200',
        border: 'dark:border-gray-600',
        ring: 'dark:ring-gray-600',
      },
    },
    status: {
      success: {
        light: 'bg-green-100 text-green-800',
        dark: 'dark:bg-green-900 dark:text-green-300',
      },
      error: {
        light: 'bg-red-100 text-red-800',
        dark: 'dark:bg-red-900 dark:text-red-300',
      },
      warning: {
        light: 'bg-yellow-100 text-yellow-800',
        dark: 'dark:bg-yellow-900 dark:text-yellow-300',
      },
      info: {
        light: 'bg-blue-100 text-blue-800',
        dark: 'dark:bg-blue-900 dark:text-blue-300',
      },
      neutral: {
        light: 'bg-gray-100 text-gray-800',
        dark: 'dark:bg-gray-900 dark:text-gray-300',
      },
    },
    surface: {
      primary: {
        light: 'bg-white',
        dark: 'dark:bg-gray-800',
      },
      secondary: {
        light: 'bg-gray-50',
        dark: 'dark:bg-gray-700',
      },
      tertiary: {
        light: 'bg-gray-100',
        dark: 'dark:bg-gray-600',
      },
    },
    text: {
      primary: {
        light: 'text-gray-900',
        dark: 'dark:text-white',
      },
      secondary: {
        light: 'text-gray-600',
        dark: 'dark:text-gray-400',
      },
      tertiary: {
        light: 'text-gray-500',
        dark: 'dark:text-gray-500',
      },
    },
    border: {
      primary: {
        light: 'border-gray-200',
        dark: 'dark:border-gray-700',
      },
      secondary: {
        light: 'border-gray-300',
        dark: 'dark:border-gray-600',
      },
      tertiary: {
        light: 'border-gray-100',
        dark: 'dark:border-gray-500',
      },
    },
    divider: {
      primary: {
        light: 'divide-gray-200',
        dark: 'dark:divide-gray-700',
      },
      secondary: {
        light: 'divide-gray-300',
        dark: 'dark:divide-gray-600',
      },
      tertiary: {
        light: 'divide-gray-100',
        dark: 'dark:divide-gray-500',
      },
    },
  },
  components: {
    button: {
      base: 'px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      variants: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
        tertiary: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
    },
    input: {
      base: 'w-full px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2',
      variants: {
        primary: 'border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400',
        secondary: 'border border-gray-200 dark:border-gray-700 focus:border-gray-400 focus:ring-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500',
        tertiary: 'border border-gray-100 dark:border-gray-800 focus:border-gray-300 focus:ring-gray-300 dark:focus:border-gray-600 dark:focus:ring-gray-600',
        error: 'border border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-400 dark:focus:ring-red-400',
      },
    },
    card: {
      base: 'rounded-lg shadow-sm border',
      variants: {
        primary: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        secondary: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600',
        tertiary: 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500',
      },
    },
  },
} as const;