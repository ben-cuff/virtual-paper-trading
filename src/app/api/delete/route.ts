import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json(
			{ error: "User ID is required" },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": `${process.env.X_API_KEY}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to delete user" },
			{ status: 500 }
		);
	}
}
