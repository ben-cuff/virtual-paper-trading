import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get("symbol");
	const resolution = searchParams.get("resolution");
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	if (!symbol || !resolution || !from || !to) {
		return NextResponse.json(
			{ error: "Missing query parameters" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`https://api.marketdata.app/v1/stocks/candles/${resolution}/${symbol}?from=${from}&to=${to}`,
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
			{ error: "Error fetching data" },
			{ status: 500 }
		);
	}
}
