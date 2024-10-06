export default async function getStockData(symbol: string) {
	const response = await fetch(
		`api/stocks/getStockData?symbol=${symbol}`
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();

	return data;
}
