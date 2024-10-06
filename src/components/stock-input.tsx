import { useEffect, useState } from "react";

const StockInput = ({ stockSymbol }: { stockSymbol: string }) => {
	interface StockData {
		o: number;
		curPrice: number;
	}

	const [data, setData] = useState<StockData | null>(null);

	useEffect(() => {
		const fetchStockPrice = async (date: string) => {
			try {
				const [stockData, response] = await Promise.all([
					(async () => {
						const response = await fetch(
							`api/stocks/getCandle?symbol=${stockSymbol}&resolution=D&from=${date}&to=${date}`
						);
						if (!response.ok) {
							throw new Error(
								`HTTP error! status: ${response.status}`
							);
						}
						return response.json();
					})(),
					(async () => {
						const response = await fetch(
							`api/stocks/getStockData?symbol=${stockSymbol}`
						);
						if (!response.ok) {
							throw new Error(
								`HTTP error! status: ${response.status}`
							);
						}
						return response.json();
					})(),
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
			} catch (err) {
				console.error(err);
			}
		};

		const fetchStockPriceInitial = () => {
			const today = new Date().toISOString().split("T")[0];
			fetchStockPrice(today);
		};

		setData(null);

		fetchStockPriceInitial();
	}, [stockSymbol]);

	if (!data) {
		return;
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
		</div>
	);
};

export default StockInput;
