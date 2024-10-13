"use client";

import { signIn } from "next-auth/react";

export default function Login() {
	return (
		<div className="">
			<button onClick={() => signIn()}>Sign In</button>
		</div>
	);
}
