"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// profile component for the user, allows them to sign in if they are not authenticated
// opens up menu with settings and signout if they are authenticated
export default function Profile() {
	const { data: session } = useSession();
	const [menuVisible, setMenuVisible] = useState(false);
	const router = useRouter();

	// Toggles the menu for when the user presses the profile picture
	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	// Handle settings click
	const handleSettingsClick = () => {
		router.push("/settings"); // Navigate to the settings page
	};

	// returns different things depending on whether or not the user is authenticated
	return (
		<div className="relative inline-block text-left">
			{session ? (
				<div>
					<Image
						className="rounded-full cursor-pointer transition-transform transform hover:scale-105"
						src="/Default-Profile-Picture-Transparent-Image.png"
						alt="Profile Picture"
						width={50}
						height={50}
						onClick={toggleMenu}
					/>
					<div
						className={`absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ease-in-out ${
							menuVisible
								? "opacity-100 translate-y-0 visible"
								: "opacity-0 translate-y-2 invisible"
						}`}
					>
						<ul className="">
							<li className="border-b border-gray-500 py-1 rounded-t-md hover:bg-gray-600 transition-colors">
								<Image
									className="w-6 h-6 mx-auto my-2 rounded-full cursor-pointer transition-transform transform hover:scale-105 "
									src="/setting.png"
									alt="Settings"
									width={30}
									height={30}
									title="Settings"
									onClick={handleSettingsClick}
								/>
							</li>
							<li
								className="px-4 text-gray-200 hover:bg-gray-600 rounded-b-md cursor-pointer transition-colors"
								style={{
									paddingTop: "11px",
									paddingBottom: "14px",
								}}
								onClick={() => void signOut()}
							>
								Logout
							</li>
						</ul>
					</div>
				</div>
			) : (
				<div>
					<Image
						className="rounded-full cursor-pointer transition-transform transform hover:scale-105 opacity-50"
						src="/Default-Profile-Picture-Transparent-Image.png"
						alt="Not Signed In"
						width={55}
						height={55}
						onClick={() => void signIn()}
					/>
				</div>
			)}
		</div>
	);
}
