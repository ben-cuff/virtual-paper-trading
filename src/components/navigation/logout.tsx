"use client";

import { signOut } from "next-auth/react";

// basic logout component
export default function Logout() {
	return (
		<div className="">
			<button onClick={() => signOut()}>Sign Out</button>
		</div>
	);
}
