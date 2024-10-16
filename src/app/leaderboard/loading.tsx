export default function LeaderboardLoading() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4 text-gray-300">
				Leaderboard (Loading...)
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
					{Array.from({ length: 5 }).map((_, index) => (
						<tr key={index} className="animate-pulse">
							<td className="py-2 px-4 border-b text-left">
								<div className="h-4 bg-gray-300 rounded w-3/4"></div>
							</td>
							<td className="py-2 px-4 border-b">
								<div className="h-4 bg-gray-300 rounded w-3/4"></div>
							</td>
							<td className="py-2 px-4 border-b text-right">
								<div className="h-4 bg-gray-300 rounded w-3/4"></div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
