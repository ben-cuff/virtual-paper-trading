import { fetchData } from "@/util/fetch-data";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// stock data needed to get the net change
interface StockData {
	o: number;
	curPrice: number;
}

// the only item I need from the api
interface StockApiResponse {
	last: number;
}

export default function StockInput({ stockSymbol }: { stockSymbol: string }) {
	const [data, setData] = useState<StockData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchStockPrice = useCallback(
		async (date: string) => {
			try {
				// gets all the data needed to construct the component
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

	// updates the current stock price
	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	}, [fetchStockPrice]);

	// returns loading
	if (loading) {
		return <p>Loading...</p>;
	}

	// stock does not exist
	if (!data && !loading) {
		return <p>Could not find stock data</p>;
	}

	let openingPrice = data ? data.o : 0;
	const curPrice = data ? data.curPrice : 0;

	if (isNaN(openingPrice)) {
		openingPrice = curPrice;
	}

	// finds the change on the day
	const dayChange = ((curPrice - openingPrice) / openingPrice) * 100;

	// refreshed the price
	const handleRefresh = () => {
		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	};

	return (
		<div className="flex items-center space-x-2">
			<span className="flex items-center space-x-1">
				<p className="text-md font-semibold">
					{stockSymbol}: {curPrice} (
					<span
						className={
							curPrice - openingPrice < 0
								? "text-red-500"
								: "text-green-500"
						}
					>
						{dayChange.toFixed(2)}%
					</span>
					)
				</p>
				<button
					onClick={handleRefresh}
					className="ml-2 bg-none border-none cursor-pointer"
				>
					<Image
						src="Refresh_icon.svg"
						alt="Refresh"
						width={16}
						height={16}
					/>
				</button>
			</span>
		</div>
	);
}
