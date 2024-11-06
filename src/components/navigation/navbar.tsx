"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Profile from "./profile";

// provides navigation for the website, accounts for large and small screens
export default function NavBar() {
	const currentRoute = usePathname();
	const { data: session } = useSession();
	const [isSideNavOpen, setIsSideNavOpen] = useState(false);
	const [isAnimatingOut, setIsAnimatingOut] = useState(false);

	// allows the user to toggle the sidebar on and off on smaller screens
	const toggleSideNav = () => {
		if (isSideNavOpen) {
			setIsAnimatingOut(true);
			setTimeout(() => {
				setIsSideNavOpen(false);
				setIsAnimatingOut(false);
			}, 300);
		} else {
			setIsSideNavOpen(true);
		}
	};

	return (
		<nav className="shadow-md py-2 text-white relative">
			<div className="flex items-center justify-between px-4 py-2">
				<div className="text-2xl font-bold hover:text-gray-400 transition duration-200 ease-in-out">
					<Link href="/">Paper Trading</Link>
				</div>
				<div className="hidden md:flex flex-grow justify-center md:justify-start ml-20 space-x-6">
					<NavLinks session={session} currentRoute={currentRoute} />
				</div>
				<div className="ml-auto mr-3 z-10">
					<Profile />
				</div>
				<div className="md:hidden">
					<button
						onClick={toggleSideNav}
						className="text-gray-400 hover:text-white focus:outline-none text-3xl mb-2"
					>
						☰
					</button>
				</div>
			</div>
			{isSideNavOpen && (
				<div
					className={`absolute right-0 transition-opacity duration-300 overflow-hidden ${
						isAnimatingOut ? "opacity-0" : "opacity-100"
					}`}
				>
					<div
						className={`w-auto bg-gray-900 p-4 z-10 transition-transform duration-300 ${
							isAnimatingOut ? "side-nav-out" : "side-nav"
						}`}
					>
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

// provides all the nav links
function NavLinks({
	session,
	currentRoute,
}: {
	session: Session | null;
	currentRoute: string;
}) {
	// current userId if is exists
	const userId = session?.user?.id || "";

	return (
		<div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
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
		</div>
	);
}
