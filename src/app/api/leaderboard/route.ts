import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ error: "Missing id in query string" },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const { total_worth } = body;

		if (total_worth === undefined) {
			return NextResponse.json(
				{ error: "Missing total worth in request body" },
				{ status: 400 }
			);
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ total_worth: total_worth }),
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		console.log(JSON.stringify(data, null, 2));
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to update leaderboard" },
			{ status: 500 }
		);
	}
}
