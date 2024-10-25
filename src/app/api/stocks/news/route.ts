import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get("symbol");

	if (!symbol) {
		return NextResponse.json(
			{ error: "Missing query parameter: symbol" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`https://api.marketdata.app/v1/stocks/news/${symbol}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.MARKETDATA_API_TOKEN}`,
				},
			}
		);

		const data = await response.json();

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error fetching stock news" },
			{ status: 500 }
		);
	}
}
