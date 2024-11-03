// loading component for the transactions component
// looks like a skeleton of the component

export default function LoadingTransactions() {
	return (
		<div className="p-4 shadow-md border-gray-400 text-white h-96 overflow-y-auto">
			<h2 className="text-xl font-bold mb-2 text-center">Transactions</h2>
			<ul className="space-y-2">
				{Array.from({ length: 5 }).map((_, index) => (
					<li
						key={index}
						className="py-2 px-4 bg-gray-700 rounded-lg shadow-sm text-sm animate-pulse"
					>
						<div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
						<div className="h-4 bg-gray-600 rounded w-1/2"></div>
					</li>
				))}
			</ul>
		</div>
	);
}
