import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                "cerulean": "#4793C3",
                "misty-jade": "#A7BCB9",
                "dourado-sol": "#D1A96D",
                "grafite-profundo": "#363A3E",
                "texto-branco": "#FFFFFF",
                "texto-cinza-claro": "#A0AEC0",
                "borda-clara": "#E2E8F0"
            },
        },
    },
    plugins: [],
};
export default config;
