"use client";

import { signIn } from "next-auth/react";

// basic sign in button component
export default function Login() {
	return (
		<div className="">
			<button onClick={() => signIn()}>Sign In</button>
		</div>
	);
}
