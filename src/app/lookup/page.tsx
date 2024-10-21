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
}

export default function Lookup() {
	const [symbol, setSymbol] = useState("");
	const [data, setData] = useState<StockCandles | null>(null);
	const [time, setTime] = useState("5D");
	const [chartType, setChartType] = useState("Candlestick");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
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
				data = await fetchData(
					`api/stocks/getCandle?symbol=${symbol}&resolution=${resolution}&from=${dateBeginTemp}&to=${dateEnd}`
				);

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

			if (data.s == "error") {
				alert(
					"Error fetching stock data for this symbol. Please try again."
				);
				return;
			}

			setData(data);
			console.log(`Stock data:`, data);
		} catch (error) {
			console.error("Error fetching stock data:", error);
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
		<div className="p-4 shadow-md max-h-screen">
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
						className="flex-grow p-2 border rounded transition-all duration-300 ease-in-out"
						placeholder="Enter stock symbol"
					/>
					<button
						type="submit"
						className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
					>
						Lookup
					</button>
				</div>
				{data && data.s !== "error" && (
					<div className="mt-2 flex flex-1">
						<div className="w-11/12">
							{chartType === "Candlestick" ? (
								<CandlestickChart />
							) : (
								<MountainLineChart />
							)}
						</div>
						<div className="w-1/12 flex flex-col ml-4 justify-between">
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
							<button
								onClick={() => setChartType("Candlestick")}
								className={`p-2 rounded ${
									chartType === "Candlestick"
										? "bg-blue-500 text-white"
										: "bg-gray-200"
								} transition-all duration-300 ease-in-out`}
							>
								Candlestick
							</button>
							<button
								onClick={() => setChartType("MountainLine")}
								className={`p-2 rounded ${
									chartType === "MountainLine"
										? "bg-blue-500 text-white"
										: "bg-gray-200"
								} transition-all duration-300 ease-in-out`}
							>
								Mountain Line
							</button>
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
