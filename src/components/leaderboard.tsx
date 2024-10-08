"use client";

import getLeaderboard from "@/util/get-leaderboard";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
	name: string;
	total_worth: number;
}

export default function Leaderboard() {
	const [leaderboard, setLeaderboard] = useState([] as LeaderboardEntry[]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getData() {
			const leaderboard = (await getLeaderboard()).leaderboard;
			setLeaderboard(leaderboard);
			setLoading(false);
		}
		getData();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Leaderboard:</h1>
			<ul>
				{leaderboard.map((entry) => (
					<li key={entry.name}>
						Name: {entry.name} Total Worth: {entry.total_worth}
					</li>
				))}
			</ul>
		</div>
	);
}
