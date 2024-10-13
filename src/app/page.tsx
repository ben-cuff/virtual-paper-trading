import Login from "@/components/login";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import Transactions from "@/components/transactions";
import { fetchData } from "@/util/fetch-data";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(authOptions);
	let user = null;
	if (session) {
		user = await fetchData(
			`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user.id}/`
		);
	}
	const balance = user ? user.balance : 0;

	if (session) {
		return (
			<div>
				<div>Welcome, {session.user?.name}</div>
				<div>Your cash available to trade is {balance.toFixed(3)}</div>

				<Transact id={session.user.id as number} />
				<Portfolio id={session.user.id as number} />
				<Transactions id={session.user.id as number} />
			</div>
		);
	}

	return (
		<div>
			<Login />
		</div>
	);
}
