"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
	const { data: session } = useSession();
	if (!session) {
		return (
			<div className="">
				<button onClick={() => signIn()}>Sign In</button>
			</div>
		);
	} else {
		console.log("Session found:", JSON.stringify(session, null, 2));
		return (
			<div className="">
				<button onClick={() => signOut()}>
					Sign Out of {session.user?.name}
				</button>
			</div>
		);
	}
}
