"use client";

import { signIn } from "next-auth/react";

export default function LandingPage() {
	return (
		<div className="text-center text-gray-200 mt-12">
			<h1 className="text-3xl font-bold">
				Welcome to Virtual Paper Trading
			</h1>
			<p className="mt-4">
				Please sign in to continue and start your journey with Virtual
				Paper Trading.
			</p>
			<p>
				Experience a risk-free environment to practice and enhance your
				trading skills.
			</p>

			<button
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={() => signIn()}
			>
				Sign In
			</button>
		</div>
	);
}
