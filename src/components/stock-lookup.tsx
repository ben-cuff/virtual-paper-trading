"use client";

import { fetchData } from "@/util/fetch-data";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	TimeScale,
	Title,
	Tooltip,
} from "chart.js";
import {
	CandlestickController,
	CandlestickElement,
} from "chartjs-chart-financial";
import { useCallback, useState } from "react";
import { Chart } from "react-chartjs-2";

// Register the chart components
ChartJS.register(
	CategoryScale,
	LinearScale,
	TimeScale, // Ensure TimeScale is registered
	Title,
	Tooltip,
	Legend,
	CandlestickController,
	CandlestickElement
);

// Define StockData interface
interface StockData {
	t: number[]; // Array of timestamps
	o: number[]; // Open prices
	h: number[]; // High prices
	l: number[]; // Low prices
	c: number[]; // Close prices
}

export default function StockLookupPage() {
	const [stockSymbol, setStockSymbol] = useState("");
	const [data, setData] = useState<StockData | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchStockPrice = useCallback(async (symbol: string) => {
		setLoading(true);
		try {
			const stockData = await fetchData(
				`${
					process.env.NEXT_PUBLIC_BASE_URL
				}/api/stocks/getCandle?symbol=${symbol}&resolution=60&from=${
					new Date().toISOString().split("T")[0]
				}&to=${new Date().toISOString().split("T")[0]}`
			);
			console.log("Stock Data:", stockData); // Debug the API response
			setData(stockData);
		} catch (err) {
			console.error("Error fetching stock data:", err);
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (stockSymbol) {
			fetchStockPrice(stockSymbol);
		}
	};

	// Prepare data for candlestick chart
	const chartData = {
		labels: data?.t
			? data.t.map((timestamp) =>
					new Date(timestamp * 1000).toLocaleTimeString()
			  )
			: [], // Ensure data.t exists before mapping
		datasets: [
			{
				label: "Candlestick Chart",
				data: data?.t
					? data.t.map((timestamp, index) => ({
							x: new Date(timestamp * 1000), // X-axis timestamp as Date object
							o: data.o[index] || 0, // Open price
							h: data.h[index] || 0, // High price
							l: data.l[index] || 0, // Low price
							c: data.c[index] || 0, // Close price
					  }))
					: [], // Ensure data.t exists before mapping
			},
		],
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={stockSymbol}
					onChange={(e) => setStockSymbol(e.target.value)}
					placeholder="Enter stock symbol"
					className="border p-2"
				/>
				<button
					type="submit"
					className="ml-2 p-2 bg-blue-500 text-white"
				>
					Lookup
				</button>
			</form>

			{loading && <p>Loading...</p>}

			{data && !loading && (
				<div>
					<Chart type="candlestick" data={chartData} />
				</div>
			)}

			{!data && !loading && <p>No data available. Please try again.</p>}
		</div>
	);
}
