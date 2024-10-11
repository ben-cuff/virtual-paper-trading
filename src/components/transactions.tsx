"use client";
import getTransactions from "@/util/get-transactions";
import { useEffect, useState } from "react";

interface Transaction {
	symbol: string;
	transaction_type: string;
	shares_quantity: number;
	price: number;
	time: string;
}

type TransactionData = Transaction[];

export default function Transactions({ id }: { id: number }) {
	const [data, setData] = useState<TransactionData | null>(null);

	useEffect(() => {
		async function getData() {
			const result = await getTransactions(id);

			const transactionsList = result.transactions.map(
				(item: {
					stock_symbol: string;
					transaction_type: string;
					shares_quantity: number;
					price: number;
					time: string;
				}) => {
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
			setData(transactionsList);
		}
		getData();
	}, [id]);

	return (
		<div>
			transactions for user <br></br>
			{data ? (
				<ul>
					{data.map((transaction, index) => (
						<li key={index}>
							{transaction.symbol} -{" "}
							{transaction.transaction_type.toUpperCase()} -{" "}
							{transaction.shares_quantity} shares at $
							{transaction.price} on{" "}
							{new Date(transaction.time).toLocaleString()}
						</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
