"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./profile";

export default function NavBar() {
	const currentRoute = usePathname();
	const { data: session } = useSession();

	if (session) {
		return (
			<nav className="shadow-md py-2">
				<div className="flex flex-col md:flex-row items-center px-4 py-2 md:py-0">
					<div className="text-2xl md:text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out mb-4 md:mb-0">
						<Link href="/">Paper Trading</Link>
					</div>
					<div className="flex-grow flex justify-center md:justify-start ml-20">
						<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10">
							<Link
								href={`/portfolio/${session.user.id}`}
								className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
									currentRoute ===
									`/portfolio/${session.user.id}`
										? "border-b-2 border-white"
										: ""
								}`}
							>
								Portfolio
							</Link>
							<Link
								href={`/transactions/${session.user.id}`}
								className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
									currentRoute ===
									`/transactions/${session.user.id}`
										? "border-b-2 border-white"
										: ""
								}`}
							>
								Transactions
							</Link>
							<Link
								href={`/lookup`}
								className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
									currentRoute === `/lookup`
										? "border-b-2 border-white"
										: ""
								}`}
							>
								Stock Lookup
							</Link>
							<Link
								href="/leaderboard"
								className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
									currentRoute === `/leaderboard`
										? "border-b-2 border-white"
										: ""
								}`}
							>
								Leaderboard
							</Link>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const formData = new FormData(
										e.currentTarget
									);
									const stockSymbol =
										formData.get("stockSymbol");
									if (stockSymbol) {
										window.location.href = `/news/${stockSymbol}`;
									}
								}}
								className="relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
							>
								<input
									type="text"
									name="stockSymbol"
									placeholder="Search News"
									className="p-2 rounded-md text-black"
									onInput={(e) => {
										e.currentTarget.value =
											e.currentTarget.value.toUpperCase();
									}}
								/>
								<button
									type="submit"
									className="ml-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-200 ease-in-out"
								>
									Search
								</button>
							</form>
						</div>
					</div>
					<Profile />
				</div>
			</nav>
		);
	}

	return (
		<nav className="shadow-md py-2">
			<div className="flex flex-col md:flex-row items-center px-4 py-2 md:py-0">
				<div className="text-2xl md:text-3xl font-bold text-white hover:text-gray-400 transition duration-200 ease-in-out mb-4 md:mb-0">
					<Link href="/">Paper Trading</Link>
				</div>
				<div className="flex-grow flex justify-center md:justify-start ml-20">
					<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10">
						<Link
							href={`/portfolio`}
							className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
								currentRoute === `/portfolio`
									? "border-b-2 border-white"
									: ""
							}`}
						>
							Portfolio
						</Link>
						<Link
							href={`/transactions`}
							className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
								currentRoute === "/transactions"
									? "border-b-2 border-white"
									: ""
							}`}
						>
							Transactions History
						</Link>
						<Link
							href={`/lookup`}
							className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
								currentRoute === `/lookup`
									? "border-b-2 border-white"
									: ""
							}`}
						>
							Stock Lookup
						</Link>
						<Link
							href="/leaderboard"
							className={`relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none ${
								currentRoute === `/leaderboard`
									? "border-b-2 border-white"
									: ""
							}`}
						>
							Leaderboard
						</Link>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.currentTarget);
								const stockSymbol = formData.get("stockSymbol");
								if (stockSymbol) {
									window.location.href = `/news/${stockSymbol}`;
								}
							}}
							className="relative inline-flex items-center p-2 md:p-4 justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
						>
							<input
								type="text"
								name="stockSymbol"
								placeholder="Search News"
								className="p-2 rounded-md text-black"
								onInput={(e) => {
									e.currentTarget.value =
										e.currentTarget.value.toUpperCase();
								}}
							/>
							<button
								type="submit"
								className="ml-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-200 ease-in-out"
							>
								Search
							</button>
						</form>
					</div>
				</div>
				<Profile />
			</div>
		</nav>
	);
}
