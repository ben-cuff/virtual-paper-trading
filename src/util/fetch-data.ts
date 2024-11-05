// this function is intended to remove GET requests from within components
export const fetchData = async (url: string | URL | Request) => {
	// attempts to make the API call given the url
	try {
		const response = await fetch(url, {
			cache: "no-store", // forces the API response to not be cached
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
