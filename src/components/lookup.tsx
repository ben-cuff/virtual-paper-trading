"use client";

import { fetchData } from "@/util/fetch-data";
import { useState } from "react";

import { Chart } from "react-google-charts";

interface StockCandles {
	s: string;
	t: number[];
	o: number[];
	h: number[];
	l: number[];
	c: number[];
	v: number[];
	curPrice: number;
}

export default function Lookup() {
	const [symbol, setSymbol] = useState("");
	const [data, setData] = useState<StockCandles | null>(null);
	const [time, setTime] = useState("5D");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const dateBegin = (() => {
			const currentDate = new Date();
			const timeMap: { [key: string]: () => Date } = {
				"1D": () =>
					new Date(currentDate.setDate(currentDate.getDate() - 1)),
				"5D": () =>
					new Date(currentDate.setDate(currentDate.getDate() - 5)),
				"3M": () =>
					new Date(currentDate.setMonth(currentDate.getMonth() - 3)),
				"1Y": () =>
					new Date(
						currentDate.setFullYear(currentDate.getFullYear() - 1)
					),
				"5Y": () =>
					new Date(
						currentDate.setFullYear(currentDate.getFullYear() - 5)
					),
				default: () =>
					new Date(currentDate.setDate(currentDate.getDate() - 30)),
			};
			return (timeMap[time] || timeMap["default"])()
				.toISOString()
				.split("T")[0];
		})();

		const dateEnd = new Date().toISOString().split("T")[0];
		try {
			const resolutions: { [key: string]: string } = {
				"1D": "1",
				"5D": "20",
				"3M": "D",
				"1Y": "2D",
				"5Y": "W",
			};

			const resolution = resolutions[time] || "H";
			let data;
			let dateBeginTemp = dateBegin;

			do {
				const [candleData, stockData] = await Promise.all([
					fetchData(
						`api/stocks/getCandle?symbol=${symbol}&resolution=${resolution}&from=${dateBeginTemp}&to=${dateEnd}`
					),
					fetchData(`api/stocks/getStockData?symbol=${symbol}`),
				]);

				console.log(JSON.stringify(stockData, null, 2));

				if (stockData.s != "ok") {
					alert(
						"Error fetching stock data for this symbol. Please try again."
					);
					return;
				}

				const curPrice = stockData.last;
				data = { ...candleData, curPrice };

				if (data.s === "no_data") {
					dateBeginTemp = new Date(
						new Date(dateBeginTemp).setDate(
							new Date(dateBeginTemp).getDate() - 1
						)
					)
						.toISOString()
						.split("T")[0];
				}
			} while (data.s === "no_data");

			setData(data);
			console.log(`Stock data:`, data);
		} catch (error) {
			console.error("Error fetching stock data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const chartData = [
		["Date", "Low", "Open", "Close", "High"],
		...(data && data.s == "ok"
			? data.t.map((timestamp, index) => [
					time === "1D"
						? new Date(timestamp * 1000).toLocaleTimeString()
						: new Date(timestamp * 1000).toLocaleDateString(),
					data.l[index],
					data.o[index],
					data.c[index],
					data.h[index],
			  ])
			: []),
	];

	const options = {
		title: "Stock Prices",
		legend: "none",
		candlestick: {
			fallingColor: { strokeWidth: 0, fill: "#a52714" },
			risingColor: { strokeWidth: 0, fill: "#0f9d58" },
		},
		backgroundColor: "#E5E7EB",
	};

	const CandlestickChart = () => {
		const minPrice = Math.min(...(data?.l || []));
		const maxPrice = Math.max(...(data?.h || []));
		const rangePadding = (maxPrice - minPrice) * 0.1;

		const adjustedOptions = {
			...options,
			vAxis: {
				viewWindow: {
					min: minPrice - rangePadding,
					max: maxPrice + rangePadding,
				},
			},
		};

		return (
			<div className="h-72">
				<Chart
					chartType="CandlestickChart"
					width="100%"
					height="100%"
					data={chartData}
					options={adjustedOptions}
				/>
			</div>
		);
	};

	return (
		<div className="p-4 shadow-md h-96">
			<form
				onSubmit={handleSubmit}
				className="transition-all duration-300 ease-in-out"
			>
				<div className="mb-2 flex items-center">
					<label className="block text-gray-200 font-bold mr-2">
						Stock Symbol:
					</label>
					<input
						type="text"
						value={symbol}
						onChange={(e) => {
							setSymbol(e.target.value.toUpperCase());
							setData(null);
						}}
						className="w-1/3 p-2 border rounded transition-all duration-300 ease-in-out"
						placeholder="Enter stock symbol"
					/>
					<button
						type="submit"
						className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
					>
						Lookup
					</button>
					<div className="ml-auto">
						{data && data.s === "ok" ? (
							<p className="text-md font-semibold text-white text-xl">
								{data.curPrice} (
								<span
									className={
										data.curPrice - data.o[0] < 0
											? "text-red-500"
											: "text-green-500"
									}
								>
									{(
										((data.curPrice - data.o[0]) /
											data.o[0]) *
										100
									).toFixed(2)}
									%
								</span>
								)
							</p>
						) : (
							<p className="text-md font-semibold text-white">
								&nbsp;
							</p>
						)}
					</div>
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center h-72 w-full">
						<div className="w-11/12 h-full bg-gray-300 animate-pulse rounded-md">
							<div className="h-full flex flex-col justify-between p-4">
								<div className="w-full h-6 bg-gray-400 rounded"></div>
								<div className="w-full h-6 bg-gray-400 rounded"></div>
								<div className="w-full h-6 bg-gray-400 rounded"></div>
								<div className="w-full h-6 bg-gray-400 rounded"></div>
								<div className="w-full h-6 bg-gray-400 rounded"></div>
							</div>
						</div>
						<div className="w-1/12 flex flex-col ml-4 h-72 justify-between">
							<div className="p-2 bg-gray-300 rounded animate-pulse">
								&nbsp;
							</div>
							<div className="p-2 bg-gray-300 rounded animate-pulse">
								&nbsp;
							</div>
							<div className="p-2 bg-gray-300 rounded animate-pulse">
								&nbsp;
							</div>
							<div className="p-2 bg-gray-300 rounded animate-pulse">
								&nbsp;
							</div>
							<div className="p-2 bg-gray-300 rounded animate-pulse">
								&nbsp;
							</div>
						</div>
					</div>
				) : (
					data &&
					data.s !== "error" && (
						<div className="mt-2 flex flex-1">
							<div className="w-11/12">
								<CandlestickChart />
							</div>
							<div className="w-1/12 flex flex-col ml-4 h-72 justify-between">
								<button
									onClick={() => {
										if (time !== "1D") setTime("1D");
									}}
									className={`p-2 rounded ${
										time === "1D"
											? "bg-blue-500 text-white"
											: "bg-gray-200"
									} transition-all duration-300 ease-in-out`}
								>
									1D
								</button>
								<button
									onClick={() => setTime("5D")}
									className={`p-2 rounded ${
										time === "5D"
											? "bg-blue-500 text-white"
											: "bg-gray-200"
									} transition-all duration-300 ease-in-out`}
								>
									5D
								</button>
								<button
									onClick={() => setTime("3M")}
									className={`p-2 rounded ${
										time === "3M"
											? "bg-blue-500 text-white"
											: "bg-gray-200"
									} transition-all duration-300 ease-in-out`}
								>
									3M
								</button>
								<button
									onClick={() => setTime("1Y")}
									className={`p-2 rounded ${
										time === "1Y"
											? "bg-blue-500 text-white"
											: "bg-gray-200"
									} transition-all duration-300 ease-in-out`}
								>
									1Y
								</button>
								<button
									onClick={() => setTime("5Y")}
									className={`p-2 rounded ${
										time === "5Y"
											? "bg-blue-500 text-white"
											: "bg-gray-200"
									} transition-all duration-300 ease-in-out`}
								>
									5Y
								</button>
							</div>
						</div>
					)
				)}
			</form>
		</div>
	);
}
