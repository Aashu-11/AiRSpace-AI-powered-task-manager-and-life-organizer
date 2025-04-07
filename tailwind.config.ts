
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
                // Airavat custom colors
                airavat: {
                    blue: '#0047AB',
                    cyan: '#00E4FF',
                    purple: '#C700FF',
                    orange: '#FF5500',
                    midnight: '#000428',
                    galactic: '#3C1053',
                    space: '#0A0A0A',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'pulse-glow': {
                    '0%, 100%': { 
                        opacity: '1',
                        filter: 'brightness(1)' 
                    },
                    '50%': { 
                        opacity: '0.8',
                        filter: 'brightness(1.2)' 
                    }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                'slide-right': {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' }
                },
                'rotate-glow': {
                    '0%': { transform: 'rotate(0deg)', filter: 'hue-rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)', filter: 'hue-rotate(360deg)' }
                },
                'sidebar-in': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' }
                },
                'sidebar-out': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'slide-up': 'slide-up 0.6s ease-out',
                'slide-right': 'slide-right 0.6s ease-out',
                'rotate-glow': 'rotate-glow 20s linear infinite',
                'sidebar-in': 'sidebar-in 0.3s ease-out',
                'sidebar-out': 'sidebar-out 0.3s ease-out'
			},
            fontFamily: {
                'grotesk': ['Space Grotesk', 'sans-serif'],
                'orbitron': ['Orbitron', 'sans-serif'],
            },
            boxShadow: {
                'neon-blue': '0 0 5px #0047AB, 0 0 20px rgba(0, 71, 171, 0.5)',
                'neon-cyan': '0 0 5px #00E4FF, 0 0 20px rgba(0, 228, 255, 0.5)',
                'neon-purple': '0 0 5px #C700FF, 0 0 20px rgba(199, 0, 255, 0.5)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            backdropBlur: {
                'glass': '8px',
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
