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
			`https://api.marketdata.app/v1/stocks/quotes/${symbol}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.MARKETDATA_API_TOKEN}`,
				},
			}
		);

		// Check if the response is ok (status in the range 200-299)
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error fetching stock data" },
			{ status: 500 }
		);
	}
}
