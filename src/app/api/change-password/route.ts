import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { id, currentPassword, newPassword } = await request.json();

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": `${process.env.X_API_KEY}`,
			},
			body: JSON.stringify({
				old_password: currentPassword,
				password: newPassword,
			}),
		}
	);

	const data = await response.json();

	console.log(JSON.stringify(data, null, 2));

	return NextResponse.json(data, { status: response.status });
}
