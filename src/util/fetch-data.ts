export const fetchData = async (url: string | URL | Request) => {
	try {
		const response = await fetch(url, {
			cache: "no-store",
			headers: {
				"x-api-key": `${process.env.X_API_KEY}`,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.json();
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};
