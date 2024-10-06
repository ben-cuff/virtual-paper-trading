import getCandle from "@/app/util/get-candle";
import getStockData from "@/app/util/get-stock-data";
import { useEffect, useState } from "react";

const StockInput = ({ stockSymbol }: { stockSymbol: string }) => {
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchStockPrice = async (date: string) => {
			try {
				const [stockData, response] = await Promise.all([
					getCandle(stockSymbol, "D", date, date),
					getStockData(stockSymbol),
				]);

				if (stockData.s === "no_data") {
					const previousDate = new Date(date);
					previousDate.setDate(previousDate.getDate() - 1);

					const fiveDaysAgo = new Date();
					fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

					if (previousDate < fiveDaysAgo) {
						throw new Error(
							"No valid stock data found for the past 5 days"
						);
					}

					return fetchStockPrice(
						previousDate.toISOString().split("T")[0]
					);
				}

				const curPrice = response.last;
				stockData.curPrice = curPrice;

				console.log(JSON.stringify(stockData, null, 2));
				setData(stockData);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err);
				} else {
					setError(new Error("An unknown error occurred"));
				}
			}
		};

		const fetchStockPriceInitial = () => {
			const today = new Date().toISOString().split("T")[0];
			fetchStockPrice(today);
		};

		// Reset error state when stockSymbol changes
		setError(null);
		setData(null);

		fetchStockPriceInitial();
	}, [stockSymbol]);

	if (error) {
		return <div>Error fetching stock data: {error.message}</div>;
	}

	if (!data) {
		return <div>Loading...</div>;
	}

	const openingPrice = data.o;
	const curPrice = data.curPrice;

	console.log(openingPrice, curPrice);

	return (
		<div>
			<p>
				{stockSymbol}: {curPrice} (
				<span
					className={
						curPrice - openingPrice < 0
							? "text-red-500"
							: "text-black"
					}
				>
					{(((curPrice - openingPrice) / openingPrice) * 100).toFixed(
						2
					)}
					%
				</span>
				)
			</p>
		</div>
	);
};

export default StockInput;
