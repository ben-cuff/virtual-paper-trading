export default async function buyStock(
	id: number,
	symbol: string,
	quantity: number,
	price: number
) {
	console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/stocks/buy?id=${id}`);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/stocks/buy?id=${id}`,
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
