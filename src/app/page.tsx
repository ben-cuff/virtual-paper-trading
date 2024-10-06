import Login from "@/components/login";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session= await getServerSession(authOptions);

	if (!session) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div>Home page</div>
			{session ? (
				<>
					<div>Welcome, {session.user?.name}</div>
					<div>
						Your cash available to trade is{" "}
						{session.user?.balance?.toFixed(2)}
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
