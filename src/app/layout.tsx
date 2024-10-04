import ClientProvider from "@/components/sessionProvider";
import type { Metadata } from "next";

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
				<ClientProvider>{children}</ClientProvider>
			</body>
		</html>
	);
}
