"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

function ProductCard({ name, info, img, href, wip = false }) {
	const [currentImg, setCurrentImg] = useState(1);
	const [isHovering, setIsHovering] = useState(false);
	const [dimensions, setDimensions] = useState(500);
	useEffect(() => {
		let interval;
		if (isHovering) {
			let count = 1;

			interval = setInterval(() => {
				if (count === img.number) count = 1;
				else count++;
				setCurrentImg(count);
			}, 600);
		} else {
			setCurrentImg(1);
			setDimensions(500);
		}
		return () => clearInterval(interval);
	}, [isHovering, img.number, img.path]);

	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			href={href}
			className="rounded-2xl relative group"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}>
			{wip && <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold z-10">WIP</div>}
			<Image
				src={`${img.path}/${currentImg}.png`}
				width={dimensions}
				height={dimensions}
				quality={80}
				className=" w-full h-full rounded-2xl"
			/>
			<h2 className="absolute top-0 left-0 p-4 uppercase font-bold text-4xl flex flex-col gap-2">
				{name}
				<span className="hidden group-hover:inline text-2xl lowercase">{info}</span>
			</h2>
		</a>
	);
}

export default ProductCard;
