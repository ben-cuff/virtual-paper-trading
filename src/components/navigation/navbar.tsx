"use client";

import { useSession } from "next-auth/react";
import Login from "./login";
import Logout from "./logout";

export default function NavBar() {
	const { data: session } = useSession();

	if (session) {
		return <Logout />;
	} else {
		<Login />;
	}
}
