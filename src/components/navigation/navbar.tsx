"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Profile from "./profile";

export default function NavBar() {
	const currentRoute = usePathname();
	const { data: session } = useSession();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<nav className="shadow-md py-2 bg-gray-800 text-white">
			<div className="flex items-center justify-between px-4 py-2">
				<div className="text-2xl font-bold hover:text-gray-400 transition duration-200 ease-in-out">
					<Link href="/">Paper Trading</Link>
				</div>
				{/* Desktop Links */}
				<div className="hidden md:flex flex-grow justify-center md:justify-start ml-20 space-x-6">
					<NavLinks session={session} currentRoute={currentRoute} />
				</div>
				<Profile />
				{/* Mobile Menu Toggle Button */}
				<div className="md:hidden ml-auto">
					<button
						onClick={toggleMobileMenu}
						className="text-gray-400 hover:text-white focus:outline-none"
					>
						☰
					</button>
				</div>
			</div>
			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className="flex flex-col items-center space-y-4 py-4">
						<NavLinks
							session={session}
							currentRoute={currentRoute}
						/>
					</div>
				</div>
			)}
		</nav>
	);
}

function NavLinks({ session, currentRoute }: { session: Session | null; currentRoute: string; }) {
	const userId = session?.user?.id || "";

	return (
		<>
			<Link
				href={`/portfolio/${userId}`}
				className={`relative p-2 rounded-md ${
					currentRoute === `/portfolio/${userId}`
						? "border-b-2 border-white"
						: "text-gray-400 hover:bg-gray-700 hover:text-white"
				}`}
			>
				Portfolio
			</Link>
			<Link
				href={`/transactions/${userId}`}
				className={`relative p-2 rounded-md ${
					currentRoute === `/transactions/${userId}`
						? "border-b-2 border-white"
						: "text-gray-400 hover:bg-gray-700 hover:text-white"
				}`}
			>
				Transactions
			</Link>
			<Link
				href={`/lookup`}
				className={`relative p-2 rounded-md ${
					currentRoute === `/lookup`
						? "border-b-2 border-white"
						: "text-gray-400 hover:bg-gray-700 hover:text-white"
				}`}
			>
				Stock Lookup
			</Link>
			<Link
				href="/leaderboard"
				className={`relative p-2 rounded-md ${
					currentRoute === `/leaderboard`
						? "border-b-2 border-white"
						: "text-gray-400 hover:bg-gray-700 hover:text-white"
				}`}
			>
				Leaderboard
			</Link>
			{/* Search News Form */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const stockSymbol = formData.get("stockSymbol");
					if (stockSymbol) {
						window.location.href = `/news/${stockSymbol}`;
					}
				}}
				className="flex items-center p-2"
			>
				<input
					type="text"
					name="stockSymbol"
					placeholder="Search News"
					className="p-2 rounded-md text-black md:w-auto w-24"
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
		</>
	);
}
