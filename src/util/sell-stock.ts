export default async function buyStock(
	id: number,
	symbol: string,
	quantity: number,
	price: number
) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/stocks/sell?id=${id}`,
		{
			method: "POST",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
			body: JSON.stringify({
				symbol: symbol,
				quantity: quantity,
				price: price,
			}),
		}
	);

	const data = await response.json();

	return data;
}
