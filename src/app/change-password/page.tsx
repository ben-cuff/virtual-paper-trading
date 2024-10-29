"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdatePasswordPage() {
	const { data: session } = useSession();
	const router = useRouter();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordCopy, setNewPasswordCopy] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!session) {
			alert("You must be logged in to change your password.");
			return;
		}

		if (newPassword.length < 8) {
			alert("New password must be at least 8 characters long");
			return;
		}

		if (newPassword !== newPasswordCopy) {
			alert("Make sure the new passwords are the same");
			return;
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/change-password`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: session.user.id,
					currentPassword: currentPassword,
					newPassword: newPassword,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			alert(`Error: ${errorData.detail}`);
			return;
		}

		const data = await response.json();

		if (!data.success) {
			alert("Your current password is incorrect");
			return;
		}

		alert("Password updated successfully");
		router.push("/");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-full max-w-sm"
			>
				<div className="mb-4">
					<label
						htmlFor="currentPassword"
						className="block text-sm font-medium text-gray-700"
					>
						Current Password:
					</label>
					<input
						type="password"
						id="currentPassword"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="newPassword"
						className="block text-sm font-medium text-gray-700"
					>
						New Password:
					</label>
					<input
						type="password"
						id="newPassword"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="newPasswordCopy"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm New Password:
					</label>
					<input
						type="password"
						id="newPasswordCopy"
						value={newPasswordCopy}
						onChange={(e) => setNewPasswordCopy(e.target.value)}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Update Password
				</button>
			</form>
			<Link
				href="/"
				className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Back to Home
			</Link>
		</div>
	);
}
