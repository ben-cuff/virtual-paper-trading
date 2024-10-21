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

export default function LookupPage() {
	const [symbol, setSymbol] = useState("");
	const [data, setData] = useState<StockCandles | null>(null);
	const [time, setTime] = useState("5D");

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
				"5D": "30",
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
					new Date(timestamp * 1000).toLocaleDateString(),
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
	};

	const CandlestickChart = () => {
		return (
			<div>
				<Chart
					chartType="CandlestickChart"
					width="100%"
					height="400px"
					data={chartData}
					options={options}
				/>
			</div>
		);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-5 p-4 rounded shadow-md transition-all duration-300 ease-in-out"
		>
			<div className="mb-4">
				<label className="block text-gray-200 font-bold mb-2">
					Stock Symbol:
				</label>
				<input
					type="text"
					value={symbol}
					onChange={(e) => {
						setSymbol(e.target.value);
						setData(null);
					}}
					className="w-full p-2 border rounded transition-all duration-300 ease-in-out"
					placeholder="Enter stock symbol"
				/>
			</div>
			<button
				type="submit"
				className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
			>
				Lookup
			</button>
			{data && data.s !== "error" && (
				<div className="mt-5">
					<CandlestickChart />
					<div className="mt-5 flex justify-around">
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
							onClick={() => setTime("ALL")}
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
			)}
		</form>
	);
}
