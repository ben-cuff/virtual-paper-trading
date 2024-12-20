// Default not found page for transactions route
export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-4xl font-bold text-gray-300">
				404: User Not Found
			</h1>
			<p className="mt-4 text-lg text-gray-300">
				The user you are looking for does not exist.
			</p>
		</div>
	);
}
