import { fetchData } from "@/util/fetch-data";
import { useCallback, useEffect, useState } from "react";

interface StockData {
	o: number;
	curPrice: number;
}

interface StockApiResponse {
	last: number;
}

export default function StockInput({ stockSymbol }: { stockSymbol: string }) {
	const [data, setData] = useState<StockData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchStockPrice = useCallback(
		async (date: string) => {
			try {
				const [stockData, response]: [StockData, StockApiResponse] =
					await Promise.all([
						fetchData(
							`api/stocks/getCandle?symbol=${stockSymbol}&resolution=D&from=${date}&to=${date}`
						),
						fetchData(
							`api/stocks/getStockData?symbol=${stockSymbol}`
						),
					]);

				const curPrice = response.last;
				stockData.curPrice = curPrice;
				setLoading(false);
				setData(stockData);
			} catch (err) {
				console.error(err);
				setLoading(false);
			}
		},
		[stockSymbol]
	);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	}, [fetchStockPrice]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!data && !loading) {
		return <p>Could not find stock data</p>;
	}

	let openingPrice = data ? data.o : 0;
	const curPrice = data ? data.curPrice : 0;

	if (isNaN(openingPrice)) {
		openingPrice = curPrice;
	}

	// Function to handle refresh
	const handleRefresh = () => {
		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	};

	return (
		<div>
			<p>
				{stockSymbol}: {curPrice} (
				<span
					className={
						curPrice - openingPrice < 0
							? "text-red-500"
							: "text-green-500"
					}
				>
					{(((curPrice - openingPrice) / openingPrice) * 100).toFixed(
						2
					)}
					%
				</span>
				)
			</p>
			<button onClick={handleRefresh}>Refresh</button>
		</div>
	);
}
