// loading component for the portfolio component
// looks like a skeleton of the component
export default function LoadingPortfolio() {
	return (
		<div className="p-4 shadow-md text-white shadow-top h-96 mt-1">
			<h2 className="text-xl font-bold mb-2 text-center">Portfolio</h2>
			<div className="mb-4">
				<div className="bg-gray-700 h-6 w-48 mb-2 ml-auto animate-pulse"></div>
			</div>
			<div className="mb-4">
				<table className="min-w-full rounded-lg shadow-sm text-sm">
					<thead>
						<tr>
							<th className="py-2 px-auto">Symbol</th>
							<th className="py-2 px-auto">Value</th>
							<th className="py-2 px-auto">Shares</th>
							<th className="py-2 px-auto">Avg Price</th>
							<th className="py-2 px-auto">Current Price</th>
							<th className="py-2 px-auto">Change</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: 5 }).map((_, index) => (
							<tr
								key={index}
								className="border-t border-gray-600 text-center"
							>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-16 animate-pulse"></div>
								</td>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-24 animate-pulse"></div>
								</td>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-12 animate-pulse"></div>
								</td>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-16 animate-pulse"></div>
								</td>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-16 animate-pulse"></div>
								</td>
								<td className="py-2 px-auto">
									<div className="bg-gray-700 h-6 w-12 animate-pulse"></div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<div className="bg-gray-700 h-6 w-48 animate-pulse"></div>
				<div className="bg-gray-700 h-6 w-24 animate-pulse"></div>
			</div>
		</div>
	);
}
