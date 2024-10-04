import { useState } from "react";

export default function Transact({ id }: { id: number }) {
	const [stockSymbol, setStockSymbol] = useState("");
	const [transactionType, setTransactionType] = useState("Buy");
	const [shares, setShares] = useState(0);
	const [dollars, setDollars] = useState(0);
	const [toggle, setToggle] = useState("shares");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({
			id,
			stockSymbol,
			transactionType,
			shares: toggle === "shares" ? shares : undefined,
			dollars: toggle === "dollars" ? dollars : undefined,
		});
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
					/>
				</label>
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
							onChange={(e) => setShares(Number(e.target.value))}
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
							onChange={(e) => setDollars(Number(e.target.value))}
						/>
					</label>
				</div>
			)}
			<button type="submit">Submit</button>
		</form>
	);
}
