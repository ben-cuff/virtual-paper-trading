export default async function getTransactions(id: number) {
	console.log(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`,
		{
			method: "GET",
			headers: new Headers({ "Content-Type": "application/json" }),
		}
	);
	const data = await response.json();

	return data;
}
