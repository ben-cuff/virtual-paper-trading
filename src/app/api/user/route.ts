export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`,
		{
			method: "GET",
			headers: new Headers({
				"Content-Type": "application/json",
			}),
		}
	);

	const data = await response.json();

	return new Response(JSON.stringify(data), {
		status: response.status,
		headers: { "Content-Type": "application/json" },
	});
}
