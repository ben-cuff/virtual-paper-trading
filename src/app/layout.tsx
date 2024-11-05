import NavBar from "@/components/navigation/navbar";
import ClientProvider from "@/components/session-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Paper Trading",
	description: "Trade with fake money",
};

// RootLayout component that wraps the application with a NavBar and ClientProvider
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-custom-gradient bg-fixed h-screen overflow-hidden">
				<ClientProvider>
					<div className="fixed w-full top-0 z-50 bg-transparent backdrop-filter backdrop-blur-lg">
						<NavBar />
					</div>
					<div className="mt-20 h-full overflow-auto">{children}</div>
				</ClientProvider>
			</body>
		</html>
	);
}
