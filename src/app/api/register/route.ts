import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { name, email, password } = await request.json();

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": `${process.env.X_API_KEY}`,
		},
		body: JSON.stringify({
			name: name,
			email: email,
			password: password,
		}),
	});

	const data = await response.json();
	return NextResponse.json(data, { status: response.status });
}
