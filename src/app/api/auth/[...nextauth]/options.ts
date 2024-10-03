import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
		const res = await fetch("http://localhost:8000/login", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: credentials?.email,
				password: credentials?.password,
			}),
		});

		const data = await res.json();

		if (res.ok && data.success) {
			console.log("login was successful");
			return data.user;
		} else {
			throw new Error(data.message || 'Login failed');
		}
      },
    }),
  ],
};
