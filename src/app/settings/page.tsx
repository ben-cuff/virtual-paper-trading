"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This is the settings page for the website. It allows the user to change their password, delete their account or reset their account.
export default function SettingsPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// checks if the user is logged in
	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	//handles when the user tries to delete their account
	const handleResetAccount = async () => {
		try {
			const response = await fetch(
				`/api/reset?id=${session?.user.id as number}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.ok) {
				router.push("/");
			} else {
				console.error("Failed to reset account");
			}
		} catch (error) {
			console.error(
				"An error occurred while resetting the account",
				error
			);
		}
	};

	//handles when the user tries to delete their account
	const handleDeleteAccount = async () => {
		try {
			const response = await fetch(
				`/api/delete?id=${session?.user.id as number}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.ok) {
				await signOut();
				router.push("/");
			} else {
				console.error("Failed to delete account");
			}
		} catch (error) {
			console.error(
				"An error occurred while deleting the account",
				error
			);
		}
	};

	return (
		<div className="flex flex-col items-center gap-2.5 mt-20">
			<button
				onClick={() => {
					if (
						confirm(
							"Are you sure you want to reset your account? This action cannot be undone."
						)
					) {
						handleResetAccount();
					}
				}}
				className="px-5 py-2.5 bg-blue-500 text-white border-none rounded cursor-pointer"
			>
				Reset Account
			</button>
			<button
				onClick={() => {
					if (
						confirm(
							"Are you sure you want to delete your account? This action cannot be undone."
						)
					) {
						handleDeleteAccount();
					}
				}}
				className="px-5 py-2.5 bg-red-600 text-white border-none rounded cursor-pointer mt-8"
			>
				Delete Account
			</button>
			<button
				onClick={() => {
					router.push("/change-password");
				}}
				className="px-5 py-2.5 bg-green-500 text-white border-none rounded cursor-pointer mt-8"
			>
				Update Password
			</button>
		</div>
	);
}
