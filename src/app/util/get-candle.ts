export default async function getCandle(
	symbol: string,
	resolution: string,
	from: string,
	to: string
) {
	const response = await fetch(
		`https://api.marketdata.app/v1/stocks/candles/${resolution}/${symbol}?from=${from}&to=${to}`,
		{
			method: "GET",
			redirect: "follow",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.MARKETDATA_API_TOKEN}`,
			},
		}
    );
    
    const data = await response.json();

    return data;
}
