export default async function sellStock(
	id: number,
	symbol: string,
	quantity: number,
	price: number
) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/sell/${id}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				stock_symbol: symbol,
				quantity: quantity,
				price_per_share: price,
			}),
		}
	);

	const data = await response.json();

	return data;
}