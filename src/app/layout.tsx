import NavBar from "@/components/navigation/navbar";
import ClientProvider from "@/components/session-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Paper Trading",
	description: "Trade with fake money",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ClientProvider>
					<div className="sticky top-0 z-50 bg-transparent backdrop-filter backdrop-blur-lg">
						<NavBar />
					</div>
					{children}
				</ClientProvider>
			</body>
		</html>
	);
}
