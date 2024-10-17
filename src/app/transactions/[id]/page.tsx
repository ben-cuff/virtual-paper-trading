import { fetchData } from "@/util/fetch-data";
import { notFound } from "next/navigation";

interface Transaction {
	stock_symbol: string;
	transaction_type: string;
	shares_quantity: number;
	price: number;
	time: string;
}

export default async function TransactionPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = params;

	let result;
	try {
		result = await fetchData(
			`${process.env.BASE_URL}/api/transactions?id=${id}`
		);
	} catch (error) {
		return notFound();
	}

	const transactionsList: TransactionData = result.transactions.map(
		(item: Transaction) => {
			return {
				stock_symbol: item.stock_symbol,
				transaction_type: item.transaction_type,
				shares_quantity: item.shares_quantity,
				price: item.price,
				time: item.time,
			};
		}
	);

	// reverses the list
	transactionsList.reverse();

	return (
		<div className="p-4 shadow-md border-gray-400 text-white overflow-y-auto">
			<h2 className="text-xl font-bold mb-2 text-center">
				Transactions for {result.user.name}
			</h2>
			{transactionsList.length > 0 ? (
				<ul className="space-y-2">
					{transactionsList.map((transaction, index) => (
						<li
							key={index}
							className="py-2 px-4 bg-gray-700 rounded-lg shadow-sm text-sm"
						>
							<p>
								<span
									className={
										transaction.transaction_type.toLowerCase() ===
										"buy"
											? "text-green-500"
											: "text-red-500"
									}
								>
									{transaction.transaction_type.toUpperCase()}
								</span>{" "}
								{transaction.shares_quantity} shares of{" "}
								{transaction.stock_symbol} for $
								{transaction.price} at{" "}
								{new Date(
									new Date(transaction.time).getTime() -
										4 * 60 * 60 * 1000
								).toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}
