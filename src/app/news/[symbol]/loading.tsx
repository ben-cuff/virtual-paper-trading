export default function NewsLoading() {
	return (
		<div className="p-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
			<h1 className="col-span-full text-4xl font-extrabold mb-4 text-center text-gray-300">
				Loading Latest News...
			</h1>

			<div className="lg:col-span-2 space-y-8">
				{[...Array(6)].map((_, index) => (
					<div
						key={index}
						className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-lg animate-pulse"
					>
						<div className="h-6 bg-blue-200 rounded w-3/4 mb-2"></div>
						<div className="h-4 bg-blue-100 rounded w-1/2"></div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{[...Array(6)].map((_, index) => (
					<div
						key={index + 6}
						className="bg-white border border-gray-200 p-6 rounded-lg shadow-md animate-pulse"
					>
						<div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
						<div className="h-4 bg-gray-100 rounded w-1/2"></div>
					</div>
				))}
			</div>
		</div>
	);
}
