import getBalance from "@/util/get-balance";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
	interface User {
		balance?: number;
	}

	interface Session {
		user: {
			id?: number;
			name?: string | null;
			email?: string | null;
			balance?: number;
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/login`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: credentials?.email,
							password: credentials?.password,
						}),
					}
				);

				const data = await res.json();

				if (res.ok && data.success) {
					return data.user;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.balance = user.balance;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				const balance = await getBalance(token.id as number);
				session.user.id = token.id as number;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.balance = balance;
			}
			return session;
		},
	},
	pages: {
		signIn: '/signin'
	}
};
