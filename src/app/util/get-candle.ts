export default async function getCandle(
	symbol: string,
	resolution: string,
	from: string,
	to: string
) {
	const response = await fetch(
		`api/stocks/getCandle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();

	return data;
}
