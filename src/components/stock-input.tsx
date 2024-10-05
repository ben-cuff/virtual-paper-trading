import getCandle from "@/app/util/get-candle";
import { useEffect, useState } from "react";

const StockInput = ({ stockSymbol }) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
        const fetchStockPrice = async (date) => {
            try {
                const stockData = await getCandle(
                    stockSymbol,
                    "D",
                    date,
                    date
                );
                if (stockData.s === "no_data") {
                    const previousDate = new Date(date);
                    previousDate.setDate(previousDate.getDate() - 1);
                    return fetchStockPrice(previousDate.toISOString().split("T")[0]);
                }
                console.log(JSON.stringify(stockData, null, 2));
                setData(stockData);
            } catch (err) {
                setError(err);
            }
        };

        const fetchStockPriceInitial = () => {
            const today = new Date().toISOString().split("T")[0];
            fetchStockPrice(today);
        };

        fetchStockPriceInitial();

	}, [stockSymbol]);

	if (error) {
		return <div>Error fetching stock data: {error.message}</div>;
	}

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>Stock Data for {stockSymbol}</h2>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

export default StockInput;
