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
			<div className="flex flex-col h-screen">
				<div className="flex flex-1">
					<div className="w-1/4">
						<Suspense fallback={<div>Loading Transact...</div>}>
							<Transact id={session.user.id as number} />
						</Suspense>
					</div>
					<div className="w-1/2"></div>
					<div className="w-1/4">
						<Suspense fallback={<div>Loading Transactions...</div>}>
							<Transactions id={session.user.id as number} />
						</Suspense>
					</div>
				</div>
				<div className="w-full">
					<Suspense fallback={<div>Loading Portfolio...</div>}>
						<Portfolio id={session.user.id as number} />
					</Suspense>
				</div>
			</div>
		);
	}

	return <div></div>;
}
