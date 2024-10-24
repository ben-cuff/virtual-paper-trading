"use client";

import buyStock from "@/util/buy-stock";
import { fetchData } from "@/util/fetch-data";
import sellStock from "@/util/sell-stock";
import { useState } from "react";
import StockInput from "./stock-input";

export default function Transact({ id }: { id: number }) {
	const [stockSymbol, setStockSymbol] = useState("");
	const [transactionType, setTransactionType] = useState("buy");
	const [shares, setShares] = useState();
	const [dollars, setDollars] = useState();
	const [toggle, setToggle] = useState("shares");
	const [stockDataToggle, setStockDataToggle] = useState(false);

	const handleStockSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stockSymbol.trim()) {
			alert("Please enter a stock symbol.");
			return;
		}

		setStockDataToggle(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stockSymbol || !transactionType || (!shares && !dollars)) {
			return;
		}

		if (shares < 0 || dollars < 0) {
			alert("Share/dollars cannot be less than 0");
			return;
		}

		let stockData;

		try {
			stockData = await fetchData(
				`api/stocks/getStockData?symbol=${stockSymbol}`
			);
		} catch (error) {
			console.error("Error fetching stock data:", error);
			alert("Failed to fetch stock data. Please try again.");
			return;
		}

		const price = Number(stockData.last);

		const quantity: number =
			toggle === "shares" ? shares ?? 0 : (dollars ?? 0) / Number(price);

		let data;
		if (
			!confirm(
				`Are you sure you want to ${transactionType} ${quantity.toFixed(
					2
				)} shares of ${stockSymbol} at $${price.toFixed(2)} per share?`
			)
		) {
			return;
		}
		if (transactionType === "buy") {
			data = await buyStock(
				id,
				stockSymbol,
				quantity,
				Number(price.toFixed(2))
			);
		} else {
			data = await sellStock(
				id,
				stockSymbol,
				quantity,
				Number(price.toFixed(2))
			);
		}

		if (data.detail) {
			alert(data.detail);
			return;
		}

		window.location.href = "/";
	};

	return (
		<div className="p-4 shadow-md text-white h-96">
			<h1 className="text-xl font-bold text-center">Transact</h1>
			<form onSubmit={handleStockSubmit} className="mb-4">
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-300 mb-1">
						Stock Symbol:
						<input
							type="text"
							value={stockSymbol.toUpperCase()}
							onChange={(e) => {
								setStockSymbol(e.target.value.toUpperCase());
								setStockDataToggle(false);
							}}
							className="mt-1 block w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</label>
					<div className="flex justify-end">
						<button
							type="submit"
							className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Submit Stock Symbol
						</button>
					</div>
				</div>
			</form>
			{stockDataToggle && (
				<form onSubmit={handleSubmit} className="space-y-2">
					<StockInput stockSymbol={stockSymbol} />
					<div className="flex justify-center items-center">
						<button
							type="button"
							onClick={() =>
								setTransactionType(
									transactionType === "buy" ? "sell" : "buy"
								)
							}
							className={`px-3 py-1 rounded-md shadow-sm text-md ${
								transactionType === "buy"
									? "text-green-500 hover:text-green-700"
									: "text-red-500 hover:text-red-700"
							}`}
						>
							{transactionType === "buy" ? "Buy" : "Sell"}
						</button>
					</div>

					<div className="flex items-center space-x-2">
						<button
							type="button"
							onClick={() => setToggle("shares")}
							className={`flex-1 px-3 py-1 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
								toggle === "shares"
									? "bg-indigo-600 text-white"
									: "bg-gray-700 text-gray-300"
							}`}
						>
							Shares
						</button>
						<button
							type="button"
							onClick={() => setToggle("dollars")}
							className={`flex-1 px-3 py-1 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
								toggle === "dollars"
									? "bg-indigo-600 text-white"
									: "bg-gray-700 text-gray-300"
							}`}
						>
							Dollars
						</button>
					</div>
					{toggle === "shares" ? (
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Shares:
								<input
									type="number"
									value={shares}
									onChange={(e) => {
										setDollars(Number(e.target.value));
										setShares(Number(e.target.value));
									}}
									className="mt-1 block w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</label>
						</div>
					) : (
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Dollars:
								<input
									type="number"
									value={dollars}
									onChange={(e) => {
										setDollars(Number(e.target.value));
										setShares(Number(e.target.value));
									}}
									className="mt-1 block w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</label>
						</div>
					)}
					<div className="flex justify-end">
						<button
							type="submit"
							className="mt-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Submit Order
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
