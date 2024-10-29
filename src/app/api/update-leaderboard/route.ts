import { fetchData } from "@/util/fetch-data";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
interface User {
	name: string;
	id: number;
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
export async function GET() {
	const users: User[] = await fetchData(
		`${process.env.NEXT_PUBLIC_API_URL}/users/`
	);
	const userIds = users.map((user) => user.id);

	try {
		await Promise.all(
			userIds.map(async (userId) => {
				try {
					const portfolioData: PortfolioData = await fetchData(
						`${process.env.BASE_URL}/api/portfolio?id=${userId}`
					);

					const updatedPortfolio = await Promise.all(
						portfolioData.portfolio.map(async (stock: Stock) => {
							const currentPrice = await fetchData(
								`${process.env.BASE_URL}/api/stocks/getStockData?symbol=${stock.stock_symbol}`
							);
							return {
								...stock,
								current_price: currentPrice.last,
							};
						})
					);

					portfolioData.portfolio = updatedPortfolio;

					const totalWorth =
						portfolioData.user.balance +
						portfolioData.portfolio.reduce(
							(acc: number, stock: Stock) =>
								acc + stock.shares_owned * stock.current_price,
							0
						);

					portfolioData.total_worth = totalWorth;

					await fetch(
						`${process.env.BASE_URL}/api/leaderboard?id=${userId}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"x-api-key": `${process.env.X_API_KEY}`,
							},
							body: JSON.stringify({ total_worth: totalWorth }),
						}
					);
				} catch (innerError) {
					console.log(
						`Error processing user with id ${userId}:`,
						innerError
					);
				}
			})
		);

		return NextResponse.json({
			message: "Leaderboard updated",
			status: 200,
		});
	} catch (error) {
		console.error("Error updating leaderboard:", error);
		return NextResponse.json({
			error: "Failed to update leaderboard",
			status: 500,
		});
	}
}
