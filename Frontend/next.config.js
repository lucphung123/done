/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		defaultUrl: "localhost:3000",
	},
	serverRuntimeConfig: {
		baseUrl: process.env.HOST,
	},
	publicRuntimeConfig: {
		baseUrl: process.env.HOST,
	},
};

module.exports = nextConfig;
// env: {
//   defaultUrl: "https://localhost:3000/api",
// }
// serverRuntimeConfig: {
//   baseUrl: process.env.PRIVATE_API_URL,
// },
// publicRuntimeConfig: {
//   baseUrl: process.env.NEXT_PUBLIC_API_URL,
// },
// };
