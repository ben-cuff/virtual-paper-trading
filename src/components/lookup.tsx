"use client";

import { useState } from "react";

export default function Lookup() {
	const [symbol, setSymbol] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log(`Looking up stock symbol: ${symbol}`);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Stock Symbol:
				<input
					type="text"
					value={symbol}
					onChange={(e) => setSymbol(e.target.value)}
				/>
			</label>
			<button type="submit">Lookup</button>
		</form>
	);
}
