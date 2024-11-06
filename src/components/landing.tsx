"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// default landing page if the user isn't authenticated
export default function LandingPage() {
	const router = useRouter();

	// routes the user to the registration page
	const handleRegister = () => {
		router.push("/register");
	};

	return (
		<div className="text-center text-gray-200 mt-12">
			<h1 className="text-3xl font-bold">
				Welcome to Virtual Paper Trading
			</h1>
			<p className="mt-4">
				Experience a risk-free environment to practice and enhance your
				trading skills.
			</p>
			<p>
				Please register or sign in to start your journey with Virtual
				Paper Trading.
			</p>

			<button
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={() => signIn()}
			>
				Sign In
			</button>
			<button
				className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
				onClick={handleRegister}
			>
				Register
			</button>
		</div>
	);
}
