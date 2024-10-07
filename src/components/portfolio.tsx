"use client";

import { fetchData } from "@/util/fetch-data";
import getPortfolio from "@/util/get-portfolio";
import { useEffect, useState } from "react";

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
	total_worth: number;
	portfolio: Stock[];
}

export default function Portfolio({ id }: { id: number }) {
	const [data, setData] = useState<PortfolioData | null>(null);

	useEffect(() => {
		async function getData() {
			const result = await getPortfolio(id);

			const updatedPortfolio = await Promise.all(
				result.portfolio.map(async (stock: Stock) => {
					const currentPrice = await fetchData(
						`api/stocks/getStockData?symbol=${stock.stock_symbol}`
					);
					return {
						...stock,
						current_price: currentPrice.last,
					};
				})
			);

			result.portfolio = updatedPortfolio;

			const totalWorth =
				result.user.balance +
				result.portfolio.reduce(
					(acc: number, stock: Stock) =>
						acc + stock.shares_owned * stock.current_price,
					0
				);
			result.total_worth = totalWorth;

			await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${result.user.id}`,
				{
					method: "POST",
					headers: new Headers({
						"Content-Type": "application/json",
					}),
					body: JSON.stringify({
						total_worth: totalWorth,
					}),
				}
			);

			setData(result);
		}
		getData();
	}, [id]);

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
								<p>
									Current Price: ${stock.current_price} (
									<span
										className={
											stock.current_price -
												stock.average_price <
											0
												? "text-red-500"
												: "text-green-500"
										}
									>
										{(
											((stock.current_price -
												stock.average_price) /
												stock.average_price) *
											100
										).toFixed(2)}
										%
									</span>
									)
								</p>
							</li>
						))}
					</ul>
					<h2>Total Portfolio Value</h2>
					<p>${data.total_worth.toFixed(2)}</p>
				</>
			)}
		</div>
	);
}
