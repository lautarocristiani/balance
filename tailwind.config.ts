import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Aquí dentro va la magia
      colors: {
        'principal': '#7e5bef', // Tu color personalizado
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config