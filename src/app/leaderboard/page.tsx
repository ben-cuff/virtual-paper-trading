export const dynamic = "force-dynamic";

import { fetchData } from "@/util/fetch-data";
import Link from "next/link";

interface LeaderboardEntry {
	name: string;
	user_id: number;
	total_worth: number;
}

export default async function LeaderboardPage() {
	const data = await fetchData(`${process.env.BASE_URL}/api/leaderboard/`);

	const leaderboard = data.leaderboard;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4 text-gray-300">
				Leaderboard:
			</h1>
			<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
				<thead className="bg-gray-200">
					<tr>
						<th className="py-2 px-4 border-b text-left">Rank</th>
						<th className="py-2 px-4 border-b text-left">Name</th>
						<th className="py-2 px-4 border-b text-right">
							Total Worth
						</th>
					</tr>
				</thead>
				<tbody>
					{leaderboard
						.slice(0, 100)
						.map((entry: LeaderboardEntry, index: number) => (
							<tr key={entry.name} className="hover:bg-gray-100">
								<td className="py-2 px-4 border-b text-left">
									{index + 1}
								</td>
								<td className="py-2 px-4 border-b">
									<Link
										href={`/portfolio/${entry.user_id}`}
										className="hover:text-blue-500 hover:underline"
									>
										{entry.name}
									</Link>
								</td>
								<td className="py-2 px-4 border-b text-right">
									{entry.total_worth}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
