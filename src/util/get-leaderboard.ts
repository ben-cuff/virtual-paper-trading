export default async function getLeaderboard() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/`,
		{
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		}
	);

	const data = await response.json();

	return data;
}
