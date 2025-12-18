/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./App.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				// Science/Biotech inspired light theme
				primary: "#0EA5E9", // Sky blue - main brand color
				"primary-dark": "#0284C7", // Darker blue for pressed states
				"primary-light": "#E0F2FE", // Very light blue for backgrounds
				secondary: "#06B6D4", // Cyan - complementary color
				"secondary-light": "#CFFAFE", // Light cyan
				accent: "#10B981", // Emerald green - for success/highlights
				"accent-light": "#D1FAE5", // Light green
				danger: "#EF4444", // Red for errors/warnings
				"font-main": "#1E293B", // Slate gray for main text
				"font-secondary": "#64748B", // Muted slate for secondary text
				"background-main": "#F8FAFC", // Very light gray background
				"background-secondary": "#FFFFFF", // Pure white for cards
				"border-color": "#E2E8F0", // Light slate for borders
			},
		},
	},
	plugins: [],
};
