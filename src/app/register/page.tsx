"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

// this page allows the user to register their account
export default function Register() {
	const { data: session } = useSession();
	const router = useRouter();

	// if they're signed in, it sends them to the home page
	if (session) {
		redirect("/");
	}

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCopy, setPasswordCopy] = useState("");

	// handles submission of the register form
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// password needs to be 8 char
		if (password.length < 8) {
			alert("Password must be at least 8 characters long");
			return;
		}

		// password and passwordCopy must be the same
		if (password !== passwordCopy) {
			alert("Make sure the passwords are the same");
			return;
		}

		// attempts to register the user with the api
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name,
					email: email,
					password: password,
				}),
			}
		);

		// if the registration fails, alert the user to the error
		if (!response.ok) {
			const errorData = await response.json();
			alert(`Error: ${errorData.detail}`);
			return;
		}

		// if all passes, send the user to the sign in page
		router.push("/signin");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-full max-w-sm"
			>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name:
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email:
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password:
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="passwordCopy"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm Password:
					</label>
					<input
						type="password"
						id="passwordCopy"
						value={passwordCopy}
						onChange={(e) => setPasswordCopy(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Register
				</button>
			</form>
			<Link
				href="/signin"
				className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Sign In
			</Link>
		</div>
	);
}
