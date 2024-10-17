module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"custom-gradient":
					"radial-gradient(circle at 50% 70px, hsl(240, 20%, 28%) 0%, hsl(240, 27%, 12%) 100%)",
			},
		},
	},
	plugins: [require("tailwind-scrollbar")],
};
