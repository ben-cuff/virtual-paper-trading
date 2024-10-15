import { fetchData } from "@/util/fetch-data";

interface Transaction {
	stock_symbol: string;
	transaction_type: string;
	shares_quantity: number;
	price: number;
	time: string;
}

type TransactionData = Transaction[];

export default async function Transactions({ id }: { id: number }) {
	const result = await fetchData(
		`${process.env.BASE_URL}/api/transactions?id=${id}`
	);

	const transactionsList: TransactionData = result.transactions.map(
		(item: Transaction) => {
			return {
				symbol: item.stock_symbol,
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
		<div>
			transactions for user <br></br>
			{transactionsList.length > 0 ? (
				<ul>
					{transactionsList.map((transaction, index) => (
						<li key={index}>
							{transaction.stock_symbol} -{" "}
							{transaction.transaction_type.toUpperCase()} -{" "}
							{transaction.shares_quantity} shares at $
							{transaction.price} on{" "}
							{new Date(transaction.time).toLocaleString()}
						</li>
					))}
				</ul>
			) : (
				<p>No transactions found.</p>
			)}
		</div>
	);
}
