import { fetchData } from "@/util/fetch-data";
import Link from "next/link";
import { notFound } from "next/navigation";

// all the data needed to make teh news route
interface News {
	s: string;
	symbol: string[];
	headline: string[];
	content: string[];
	source: string[];
	publicationDate: number[];
	updated: number;
}

// constructs the news page
export default async function NewsPage({
	params,
}: {
	params: { symbol: string };
}) {
	const { symbol } = params; // the stock symbol string from the dynamic route

	let news: News;

	// attempts to get the news for the given stock symbol
	try {
		const newsResponse = await fetchData(
			`${process.env.BASE_URL}/api/stocks/news?symbol=${symbol}`
		);

		// if the status is not ok, then it returns the not found page
		if (newsResponse.s != "ok") {
			return notFound();
		}

		news = newsResponse;
	} catch (error) {
		// if any other error occurs, it shows the not found page
		return notFound();
	}

	return (
		<div className="p-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
			<h1 className="col-span-full text-4xl font-extrabold mb-4 text-center text-gray-300">
				Latest News for {symbol.toUpperCase()}
			</h1>

			<div className="lg:col-span-2 space-y-8">
				{news.headline.slice(0, 6).map((headline, index) => (
					<div
						key={index}
						className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
					>
						<Link
							href={news.source[index]}
							className="text-xl font-bold text-blue-600 hover:text-blue-700"
						>
							{headline}
						</Link>
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{news.headline.slice(6).map((headline, index) => (
					<div
						key={index + 2}
						className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
					>
						<Link
							href={news.source[index + 2]}
							className="text-md font-semibold text-blue-600 hover:text-blue-800"
						>
							{headline}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
