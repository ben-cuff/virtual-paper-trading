import LandingPage from "@/components/landing";
import LoadingPortfolio from "@/components/loading/loading-portfolio";
import LoadingTransactions from "@/components/loading/loading-transactions";
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
				<div className="flex">
					<div className="w-1/4">
						<Transact id={session.user.id as number} />
					</div>
					<div className="w-1/2"></div>
					<div className="w-1/4">
						<Suspense fallback={<LoadingTransactions />}>
							<Transactions id={session.user.id as number} />
						</Suspense>
					</div>
				</div>
				<div className="flex-1 w-full">
					<Suspense fallback={<LoadingPortfolio />}>
						<Portfolio id={session.user.id as number} />
					</Suspense>
				</div>
			</div>
		);
	}

	return <LandingPage />;
}
