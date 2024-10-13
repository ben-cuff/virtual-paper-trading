"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
	return (
		<div className="">
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
