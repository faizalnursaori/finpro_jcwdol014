
import daisyui from 'daisyui'

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    colors: {
      'pinky': '#F7F2E6'
    },
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes:['emerald']
  }
} 

export default config