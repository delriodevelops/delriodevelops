import ProductCard from "@/components/product-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const page = () => {
	const products = [
		{
			name: "Fainancial",
			info: "Transform complex earnings calls into actionable insights instantly",
			img: {
				path: "/fainancial",
				number: 5,
			},
			href: "https://fainancial.app/",
			wip: true,
		},
		{
			name: "meshmind",
			info: "Create your custom chain of thought",
			img: {
				path: "/meshmind",
				number: 4,
			},
			href: "https://meshmind.vercel.app/",
		},
		{
			name: "Escudo Leal JPT",
			info: "Landing page of Escudo Leal JPT",
			img: {
				path: "/escudolealjpt",
				number: 1,
			},
			href: "https://www.escudolealjpt.com",
		},
		{
			name: "Baitme",
			info: "Test your thumbnails and get the best one for your video!",
			img: {
				path: "/baitme",
				number: 1,
			},
			href: "https://baitme.iamdelrio.com/",
		},
	];

	return (
		<div className="mx-auto min-h-screen py-8 px-4 lg:px-16 flex flex-col gap-8 lg:gap-16">
			<h1 className="uppercase text-5xl font-bold">products</h1>
			<p className="text-neutral-400">These are complete products. With more complexity and adding unique value to the user.</p>
			<div className="text-2xl p-2 gap-3 bg-neutral-900 uppercase rounded-xl flex w-fit">
				<Link href="/products" className="rounded-xl bg-neutral-700 p-3">
					products
				</Link>
				<Link href="/projects" className="rounded-xl p-3 hover:bg-neutral-800">
					projects
				</Link>
			</div>
			<section className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{products.map((item, i) => (
					<ProductCard {...item} key={i} />
				))}
			</section>
		</div>
	);
};

export default page;
