import { fetchData } from "@/util/fetch-data";

interface User {
	name: string;
	balance: number;
}

interface Stock {
	stock_symbol: string;
	shares_owned: number;
	average_price: number;
	current_price: number;
	total_change: number;
}

interface PortfolioData {
	user: User;
	total_worth: number;
	portfolio: Stock[];
}

export default async function Portfolio({ id }: { id: number }) {
	const stockData: PortfolioData = await fetchData(
		`${process.env.BASE_URL}/api/portfolio?id=${id}`
	);

	const updatedPortfolio = await Promise.all(
		stockData.portfolio.map(async (stock: Stock) => {
			const currentPrice = await fetchData(
				`${process.env.BASE_URL}/api/stocks/getStockData?symbol=${stock.stock_symbol}`
			);
			return {
				...stock,
				current_price: currentPrice.last,
			};
		})
	);

	stockData.portfolio = updatedPortfolio;

	const totalWorth =
		stockData.user.balance +
		stockData.portfolio.reduce(
			(acc: number, stock: Stock) =>
				acc + stock.shares_owned * stock.current_price,
			0
		);

	stockData.total_worth = totalWorth;

	await fetch(`${process.env.BASE_URL}/api/leaderboard?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ total_worth: totalWorth }),
	});

	stockData.portfolio = stockData.portfolio.map((stock: Stock) => ({
		...stock,
		total_change:
			((stock.current_price - stock.average_price) /
				stock.average_price) *
			100,
	}));

	return (
		<div className="p-4 shadow-md text-white shadow-top h-96 mt-1">
			<h2 className="text-xl font-bold mb-2 text-center">Portfolio</h2>
			{stockData ? (
				<>
					<div className="mb-4 text-right">
						<p>
							Cash available to trade: $
							{stockData.user.balance.toFixed(3)}
						</p>
					</div>
					<div className="mb-4">
						<table className="min-w-full  rounded-lg shadow-sm text-sm">
							<thead>
								<tr>
									<th className="py-2 px-auto">Symbol</th>
									<th className="py-2 px-auto">Value</th>
									<th className="py-2 px-auto">Shares</th>
									<th className="py-2 px-auto">Avg Price</th>
									<th className="py-2 px-auto">
										Current Price
									</th>
									<th className="py-2 px-auto">Change</th>
								</tr>
							</thead>
							<tbody>
								{stockData.portfolio.map(
									(stock: Stock, index: number) => (
										<tr
											key={index}
											className="border-t border-gray-600 text-center"
										>
											<td className="py-2 px-auto font-semibold">
												{stock.stock_symbol}
											</td>
											<td className="py-2 px-auto">
												$
												{(
													stock.shares_owned *
													stock.current_price
												).toFixed(2)}
											</td>
											<td className="py-2 px-auto">
												{stock.shares_owned}
											</td>
											<td className="py-2 px-auto">
												${stock.average_price}
											</td>
											<td className="py-2 px-auto">
												${stock.current_price}
											</td>
											<td className="py-2 px-auto">
												<span
													className={
														stock.total_change < 0
															? "text-red-400"
															: "text-green-400"
													}
												>
													{stock.total_change.toFixed(
														2
													)}
													%
												</span>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
					<div>
						<h3 className="text-lg font-semibold">
							Total Portfolio Value
						</h3>
						<p className="text-lg">
							${stockData.total_worth.toFixed(2)}
						</p>
					</div>
				</>
			) : (
				<p>No portfolio data found.</p>
			)}
		</div>
	);
}
