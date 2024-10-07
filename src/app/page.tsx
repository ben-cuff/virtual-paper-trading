import Login from "@/components/login";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import { fetchData } from "@/util/fetch-data";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(authOptions);

	const user = await fetchData(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user.id}/`
	);

	const balance = user.balance;

	return (
		<div>
			<div>Home page</div>
			{session ? (
				<>
					<div>Welcome, {session.user?.name}</div>
					<div>
						Your cash available to trade is {balance.toFixed(3)}
					</div>

					<Transact id={session.user.id as number} />
					<Portfolio id={session.user.id as number} />
				</>
			) : (
				<></>
			)}
			<Login />
		</div>
	);
}
