/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Urbanist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        // Design System Colors
        primary: {
          DEFAULT: '#6B21A8', // Primary purple
          50: '#F3E8FF',
          100: '#E9D5FF',
          200: '#D8B4FE',
          300: '#C084FC',
          400: '#A855F7',
          500: '#6B21A8',
          600: '#580F9A',
          700: '#4C1275',
          800: '#3B0F5C',
          900: '#2D0A47',
        },
        secondary: {
          DEFAULT: '#00FFD1', // Teal/cyan
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#00FFD1',
          600: '#00C2B3',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#FF6B35', // Orange/red
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B35',
          600: '#E85C2E',
          700: '#CC4F29',
          800: '#9A3412',
          900: '#7C2D12',
        },
        neutral: {
          DEFAULT: '#1F2937', // Dark gray
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Background colors
        background: {
          app: '#F9FAFB',
          card: '#FFFFFF',
          highlight: 'rgba(0, 255, 209, 0.05)', // Secondary with 5% opacity
          alert: 'rgba(255, 107, 53, 0.05)', // Accent with 5% opacity
        },
        // Button colors
        button: {
          primary: {
            DEFAULT: '#6B21A8',
            hover: '#580F9A',
            active: '#4C1275',
            disabled: '#A78BFA',
            text: '#FFFFFF',
            textDisabled: '#E0D7F8',
          },
          secondary: {
            DEFAULT: '#00FFD1',
            hover: '#33FFE8',
            active: '#00C2B3',
            disabled: '#A0F7F2',
            text: '#1F2937',
            textDisabled: '#4B5563',
          },
          destructive: {
            DEFAULT: '#FF6B35',
            hover: '#E85C2E',
            active: '#CC4F29',
            disabled: '#FFB49A',
            text: '#FFFFFF',
            textDisabled: '#FFF3F0',
          },
        },
        // Table colors
        table: {
          header: '#6B21A8',
          row: '#1F2937',
          hover: 'rgba(107, 33, 168, 0.05)',
          selected: 'rgba(107, 33, 168, 0.15)',
          border: '#E5E7EB',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

