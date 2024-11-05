// allows the user to sell a stock
export default async function sellStock(
	id: number,
	symbol: string,
	quantity: number,
	price: number
) {
	// makes the sell API call given the props
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
