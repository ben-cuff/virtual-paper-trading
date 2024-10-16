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

	stockData.portfolio = stockData.portfolio.map((stock: Stock) => ({
		...stock,
		total_change:
			((stock.current_price - stock.average_price) /
				stock.average_price) *
			100,
	}));

	return (
		<div>
			{stockData && (
				<>
					<h2>User Information</h2>
					<p>Name: {stockData.user.name}</p>
					<p>
						Cash available to trade: $
						{stockData.user.balance.toFixed(3)}
					</p>
					<h2>Portfolio</h2>
					<ul>
						{stockData.portfolio.map(
							(stock: Stock, index: number) => (
								<li key={index}>
									<p>Stock Symbol: {stock.stock_symbol}</p>
									<p>
										Total Value: $
										{(
											stock.shares_owned *
											stock.average_price
										).toFixed(2)}
									</p>
									<p>Shares Owned: {stock.shares_owned}</p>
									<p>Average Price: ${stock.average_price}</p>
									<p>
										Current Price: ${stock.current_price} (
										<span
											className={
												stock.total_change < 0
													? "text-red-500"
													: "text-green-500"
											}
										>
											{stock.total_change.toFixed(2)}%
										</span>
										)
									</p>
								</li>
							)
						)}
					</ul>
					<h2>Total Portfolio Value</h2>
					<p>${stockData.total_worth.toFixed(2)}</p>
				</>
			)}
		</div>
	);
}
