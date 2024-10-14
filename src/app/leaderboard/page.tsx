"use client";

import getLeaderboard from "@/util/get-leaderboard";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
	name: string;
	total_worth: number;
}

export default function LeaderboardPage() {
	const [leaderboard, setLeaderboard] = useState([] as LeaderboardEntry[]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getData() {
			try {
				const response = await getLeaderboard();
				setLeaderboard(response.leaderboard);
			} catch (error) {
				console.error("Error fetching leaderboard data:", error);
			} finally {
				setLoading(false);
			}
		}
		getData();
	}, []);

	if (loading) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4 text-gray-300">
					Leaderboard (Loading...)
				</h1>
				<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
					<thead className="bg-gray-200">
						<tr>
							<th className="py-2 px-4 border-b text-left">
								Rank
							</th>
							<th className="py-2 px-4 border-b text-left">
								Name
							</th>
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
					{leaderboard.slice(0, 100).map((entry, index) => (
						<tr key={entry.name} className="hover:bg-gray-100">
							<td className="py-2 px-4 border-b text-left">
								{index + 1}
							</td>
							<td className="py-2 px-4 border-b">{entry.name}</td>
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
