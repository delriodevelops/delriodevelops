import React from "react";
import Link from "next/link";

const PostPreview = ({ post }) => {
	const { category, title, resume, _id, date } = post;

	return (
		<div className="py-8 flex flex-wrap md:flex-nowrap">
			<div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
				<span className="font-semibold title-font text-white">
					{category.toUpperCase()}
				</span>
				<span className="mt-1 text-gray-500 text-sm">
					{new Date(date).toLocaleString()}
				</span>
			</div>
			<div className="md:flex-grow">
				<h2 className="text-2xl font-medium text-white title-font mb-2">
					{title}
				</h2>
				<p className="leading-relaxed">{resume}</p>
				<Link href={`blog/${_id}`}>
					<a className="text-blue-400 inline-flex items-center mt-4">
						Learn More
						<svg
							className="w-4 h-4 ml-2"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14"></path>
							<path d="M12 5l7 7-7 7"></path>
						</svg>
					</a>
				</Link>
			</div>
		</div>
	);
};

export default PostPreview;
