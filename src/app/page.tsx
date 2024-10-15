import Login from "@/components/navigation/login";
import Logout from "@/components/navigation/logout";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import Transactions from "@/components/transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (session) {
		return (
			<div>
				<Transact id={session.user.id as number} />
				<Portfolio id={session.user.id as number} />
				<Transactions id={session.user.id as number} />
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
