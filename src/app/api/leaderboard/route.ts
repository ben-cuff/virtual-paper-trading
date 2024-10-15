import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/`,
				{
					method: "GET",
					headers: new Headers({
						"Content-Type": "application/json",
					}),
				}
			);

			const data = await response.json();
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch leaderboard" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch leaderboard" },
			{ status: 500 }
		);
	}
}
