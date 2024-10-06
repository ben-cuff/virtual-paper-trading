import buyStock from "@/app/util/buy-stock";
import getStockData from "@/app/util/get-stock-data";
import { reloadSession } from "@/app/util/reload-session";
import sellStock from "@/app/util/sell-stock";
import StockInput from "./stock-input";
import { useState } from "react";

export default function Transact({ id }: { id: number }) {
	const [stockSymbol, setStockSymbol] = useState("");
	const [transactionType, setTransactionType] = useState("buy");
	const [shares, setShares] = useState(0);
	const [dollars, setDollars] = useState(0);
	const [toggle, setToggle] = useState("shares");
	const [stockDataToggle, setStockDataToggle] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stockSymbol || !transactionType || (!shares && !dollars)) {
			alert("Please fill in all fields.");
			return;
		}

		const stockData = await getStockData(stockSymbol);

		console.log(JSON.stringify(stockData,null,2))

		const price = Number(stockData.last);

		const quantity: number = toggle === "shares" ? (shares ?? 0) : (dollars ?? 0) / Number(price);

		let data;

		if (transactionType === "buy") {
			data = await buyStock(id, stockSymbol, quantity, Number(price.toFixed(2)));
		} else {
			data = await sellStock(id, stockSymbol, quantity, Number(price.toFixed(2)));
		}

		if (data.detail) {
			alert(data.detail);
			return;
		}

		reloadSession();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>
					Stock Symbol:
					<input
						type="text"
						value={stockSymbol}
						onChange={(e) => setStockSymbol(e.target.value)}
						onBlur={async () => {
							if (stockSymbol) {
								setStockDataToggle(true);
							} else {
								setStockDataToggle(false);
							}
						}}
					/>
				</label>
				{stockDataToggle && (
					<StockInput stockSymbol={stockSymbol} />
				)}
			</div>
			<div>
				<label>
					Transaction Type:
					<select
						value={transactionType}
						onChange={(e) => setTransactionType(e.target.value)}
					>
						<option value="buy">Buy</option>
						<option value="sell">Sell</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					<input
						type="radio"
						value="shares"
						checked={toggle === "shares"}
						onChange={() => setToggle("shares")}
					/>
					Shares
				</label>
				<label>
					<input
						type="radio"
						value="dollars"
						checked={toggle === "dollars"}
						onChange={() => setToggle("dollars")}
					/>
					Dollars
				</label>
			</div>
			{toggle === "shares" ? (
				<div>
					<label>
						Shares:
						<input
							type="number"
							value={shares}
							onChange={(e) => {
								setDollars(Number(e.target.value));
								setShares(Number(e.target.value));
							}}
						/>
					</label>
				</div>
			) : (
				<div>
					<label>
						Dollars:
						<input
							type="number"
							value={dollars}
							onChange={(e) => {
								setDollars(Number(e.target.value));
								setShares(Number(e.target.value));
							}}
						/>
					</label>
				</div>
			)}
			<button type="submit">Submit</button>
		</form>
	);
}
