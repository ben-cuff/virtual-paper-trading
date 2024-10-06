import { fetchData } from "@/app/util/fetch-data";
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
					(async () =>
						fetchData(
							`api/stocks/getCandle?symbol=${stockSymbol}&resolution=D&from=${date}&to=${date}`
						))(),
					(async () =>
						fetchData(
							`api/stocks/getStockData?symbol=${stockSymbol}`
						))(),
				]);

				const curPrice = response.last;
				stockData.curPrice = curPrice;

				setData(stockData);
			} catch (err) {
				console.error(err);
			}
		};

		const today = new Date().toISOString().split("T")[0];
		fetchStockPrice(today);
	}, [stockSymbol]);

	if (!data) {
		return;
	}

	let openingPrice = data.o;
	const curPrice = data.curPrice;

	if (isNaN(openingPrice)) {
		openingPrice = curPrice;
	}

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
