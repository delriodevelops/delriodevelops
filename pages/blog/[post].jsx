import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "../../components/Spinner";

const Post = () => {
	const router = useRouter();
	const { post } = router.query;

	const [postContent, setPostContent] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!!post) {
			fetch(`/api/blog/${post}`)
				.then((res) => res.json())
				.then((data) => setPostContent(data))
				.then(() => {
					setLoading(false);
				});
		}
	}, [post]);

	if (!loading) {
		return (
			<section className="w-full container text-gray-100 md:w-2/3 flex bg-gray-900  flex-col items-center px-3 max-w-screen-xl px-4 py-32 mx-auto lg:items-center lg:flex">
				<h1>{postContent.title}</h1>
				<article className="flex flex-col shadow my-4">
					<div className="flex flex-col justify-start p-6">
						<a className="text-blue-700 text-sm font-bold uppercase pb-4">
							{postContent.category}
						</a>
						<p className="text-sm pb-8">
							By{" "}
							<a className="font-semibold hover:text-gray-800">
								Christian del Rio Rodriguez
							</a>
							, Published on {new Date(postContent.date).toLocaleDateString()}
						</p>
						<h1 className="text-2xl font-bold pb-3">Introduction</h1>
						<p className="pb-3">{postContent.resume}</p>
						<h1 className="text-2xl font-bold pb-3">Content</h1>
						<p className="pb-3">{postContent.content}</p>
					</div>
				</article>
			</section>
		);
	} else {
		return <Spinner />;
	}
};

export default Post;
