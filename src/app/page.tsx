"use client";

import Login from "@/components/login";
import Transact from "@/components/transact";
import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div>Home page</div>
			{session ? (
				<>
					<div>Welcome, {session.user?.name}</div>
					<div>
						Your cash available to trade is {session.user?.balance?.toFixed(2)}
					</div>

					<Transact id={session.user.id as number} />
				</>
			) : (
				<></>
			)}
			<Login />
		</div>
	);
}
