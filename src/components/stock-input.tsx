import { fetchData } from "@/util/fetch-data";
import { useCallback, useEffect, useState } from "react";

const StockInput = ({ stockSymbol }: { stockSymbol: string }) => {
	interface StockData {
		o: number;
		curPrice: number;
	}

	const [data, setData] = useState<StockData | null>(null);

	const fetchStockPrice = useCallback(
		async (date: string) => {
			try {
				const [stockData, response] = await Promise.all([
					fetchData(
						`api/stocks/getCandle?symbol=${stockSymbol}&resolution=D&from=${date}&to=${date}`
					),
					fetchData(`api/stocks/getStockData?symbol=${stockSymbol}`),
				]);

				const curPrice = response.last;
				stockData.curPrice = curPrice;

				setData(stockData);
			} catch (err) {
				console.error(err);
			}
		},
		[stockSymbol]
	);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	}, [fetchStockPrice]);

	if (!data) {
		return <p>Loading...</p>;
	}

	let openingPrice = data.o;
	const curPrice = data.curPrice;

	if (isNaN(openingPrice)) {
		openingPrice = curPrice;
	}

	if (curPrice === undefined || curPrice === null) {
		throw new Error("Current price is not available");
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
};

export default StockInput;
