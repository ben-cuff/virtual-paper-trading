"use client";

import getPortfolio from "@/util/get-portfolio";
import { useEffect, useState } from "react";
import { fetchData } from "@/util/fetch-data";

export default function Portfolio({ id }: { id: number }) {
	interface User {
		name: string;
		balance: number;
	}

	interface Stock {
		stock_symbol: string;
		shares_owned: number;
        average_price: number;
        current_price: number;
	}

	interface PortfolioData {
		user: User;
		portfolio: Stock[];
	}

	const [data, setData] = useState<PortfolioData | null>(null);

	useEffect(() => {
		async function fetchData() {
			const result = await getPortfolio(id);
			setData(result);
		}
		fetchData();
	}, [id]);

	useEffect(() => {
		if (data) {
			console.log(JSON.stringify(data, null, 2));
		}
	}, [data]);

	return (
		<div>
			{data && (
				<>
					<h2>User Information</h2>
					<p>Name: {data.user.name}</p>
					<p>Cash available to trade: ${data.user.balance}</p>
					<h2>Portfolio</h2>
					<ul>
						{data.portfolio.map((stock: Stock, index: number) => (
							<li key={index}>
								<p>Stock Symbol: {stock.stock_symbol}</p>
								<p>
									Total Value: $
									{(
										stock.shares_owned * stock.average_price
									).toFixed(2)}
								</p>
								<p>Shares Owned: {stock.shares_owned}</p>
								<p>Average Price: ${stock.average_price}</p>
							</li>
						))}
					</ul>
					<h2>Total Portfolio Value</h2>
					<p>
						$
						{(
							data.user.balance +
							data.portfolio.reduce(
								(acc, stock) =>
									acc +
									stock.shares_owned * stock.average_price,
								0
							)
						).toFixed(2)}
					</p>
				</>
			)}
		</div>
	);
}
