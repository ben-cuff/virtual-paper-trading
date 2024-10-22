"use client";

import { fetchData } from "@/util/fetch-data";
import Image from "next/image";
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
	const [chartType, setChartType] = useState("Candlestick");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const dateBegin = (() => {
			const currentDate = new Date();
			const timeMap: { [key: string]: () => Date } = {
				"1D": () =>
					new Date(currentDate.setDate(currentDate.getDate())),
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
			fallingColor: { strokeWidth: 0, fill: "#0f9d58" },
			risingColor: { strokeWidth: 0, fill: "#a52714" },
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
			<div>
				<Chart
					chartType="CandlestickChart"
					width="100%"
					height="550px"
					data={chartData}
					options={adjustedOptions}
				/>
			</div>
		);
	};

	const MountainLineChart = () => {
		const lineChartData = [
			["Date", "Close"],
			...(data && data.s == "ok"
				? data.t.map((timestamp, index) => [
						time === "1D"
							? new Date(timestamp * 1000).toLocaleTimeString()
							: new Date(timestamp * 1000).toLocaleDateString(),
						data.c[index],
				  ])
				: []),
		];

		const lineChartOptions = {
			title: "Stock Prices",
			legend: "none",
			backgroundColor: "#E5E7EB",
			hAxis: {
				title: "Date",
			},
			vAxis: {
				title: "Price",
			},
			series: {
				0: { areaOpacity: 0.3 },
			},
		};

		return (
			<div>
				<Chart
					chartType="AreaChart"
					width="100%"
					height="550px"
					data={lineChartData}
					options={lineChartOptions}
				/>
			</div>
		);
	};

	return (
		<div className="p-4 max-h-screen">
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
						className="w-1/6 p-2 border rounded transition-all duration-300 ease-in-out"
						placeholder="Enter stock symbol"
					/>
					<button
						type="submit"
						className="ml-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
					>
						Lookup
					</button>
					{data && data.s === "ok" && (
						<div className="flex items-center ml-auto">
							<p className="text-md font-semibold text-white text-lg">
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
							<button
								onClick={async (e) => {
									e.preventDefault();
									const refreshButton = e.currentTarget;
									refreshButton.classList.add(
										"animate-spin-reverse"
									);
									await handleSubmit(e);
									setTimeout(() => {
										refreshButton.classList.remove(
											"animate-spin-reverse"
										);
									}, 1000);
								}}
								className="ml-2"
							>
								<Image
									src="Refresh_icon.svg"
									alt="Refresh icon"
									width="25"
									height="25"
								/>
							</button>
						</div>
					)}
				</div>
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : (
					data &&
					data.s !== "error" && (
						<div className="mt-2 flex flex-1">
							<div className="w-11/12">
								{chartType === "Candlestick" ? (
									<CandlestickChart />
								) : (
									<MountainLineChart />
								)}
							</div>
							<div className="w-1/12 flex flex-col ml-4 justify-between">
								<select
									value={chartType}
									onChange={(e) =>
										setChartType(e.target.value)
									}
									className="p-2 rounded bg-gray-200 transition-all duration-300 ease-in-out"
								>
									<option value="Candlestick">
										Candlestick
									</option>
									<option value="MountainLine">
										Mountain
									</option>
								</select>
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
