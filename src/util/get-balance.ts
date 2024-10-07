export default async function getBalance(id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`,
        {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        }
    )

    const data = await response.json();

    return data.balance;
}
