import Login from "@/components/navigation/login";
import Logout from "@/components/navigation/logout";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import Transactions from "@/components/transactions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (session) {
		return (
			<div>
				<Suspense fallback={<div>Loading Transact...</div>}>
					<Transact id={session.user.id as number} />
				</Suspense>
				<Suspense fallback={<div>Loading Portfolio...</div>}>
					<Portfolio id={session.user.id as number} />
				</Suspense>
				<Suspense fallback={<div>Loading Transactions...</div>}>
					<Transactions id={session.user.id as number} />
				</Suspense>
				<Logout />
			</div>
		);
	}

	return (
		<div>
			<Login />
		</div>
	);
}
