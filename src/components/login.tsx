"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
	const { data: sessionData } = useSession();
	console.log(sessionData);
	if (!sessionData) {
		return (
			<div className="">
				<button onClick={() => signIn()}>Sign In</button>
			</div>
		);
	} else {
		return (
			<div className="">
				<button onClick={() => signOut()}>Sign Out</button>
			</div>
		);
	}
}
