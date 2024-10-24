import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { symbol, quantity, price } = await request.json();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/sell/${id}`,
			{
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json",
					"x-api-key": `${process.env.X_API_KEY}`,
				}),
				body: JSON.stringify({
					stock_symbol: symbol,
					quantity: quantity,
					price_per_share: price,
				}),
			}
		);

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}
