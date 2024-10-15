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
