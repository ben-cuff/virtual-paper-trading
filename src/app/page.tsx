import LandingPage from "@/components/landing";
import LoadingPortfolio from "@/components/loading/loading-portfolio";
import LoadingTransactions from "@/components/loading/loading-transactions";
import Lookup from "@/components/lookup";
import Portfolio from "@/components/portfolio";
import Transact from "@/components/transact";
import Transactions from "@/components/transactions";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "./api/auth/[...nextauth]/options";

/**
 * The main component for the home page of the virtual paper trading application.
 *
 * This component determines whether a user session exists and renders different
 * components based on the session state. If a session is found, it displays the
 * main trading interface with sections for transactions, portfolio, and lookup.
 * If no session is found, it displays the landing page.
 *
 */
export default async function HomePage() {
	const session = await getServerSession(authOptions);

	if (session) {
		return (
			<div className="flex flex-col h-screen">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/4">
						<Transact id={session.user.id as number} />
					</div>
					<div className="w-full md:w-1/2">
						<Lookup />
					</div>
					<div className="w-full md:w-1/4">
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
