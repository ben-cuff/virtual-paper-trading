import { fetchData } from "@/util/fetch-data";
import { NextApiRequest, NextApiResponse } from 'next';

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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        await updateLeaderboard();
        res.status(200).json({ message: 'Leaderboard updated successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export async function updateLeaderboard() {
    try {
        const users: User[] = await fetchData(`${process.env.BASE_URL}/api/users`);

        for (const user of users) {
            const portfolioData: PortfolioData = await fetchData(
                `${process.env.BASE_URL}/api/portfolio?id=${user.name}`
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

            await fetch(`${process.env.BASE_URL}/api/leaderboard?id=${user.name}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ total_worth: totalWorth }),
            });
        }
    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
}