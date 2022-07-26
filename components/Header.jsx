import React, { useContext, useEffect } from "react";
import { FaInbox } from "react-icons/fa";
import Link from "next/link";
import checkLocalStorage from "../services/checkLocalStorage";
import { GlobalContext } from "../context/GlobalContext";

const Header = () => {
	const { user, setUser } = useContext(GlobalContext);
	useEffect(() => {
		const localUser = checkLocalStorage("user");
		!!localUser && setUser(localUser);
	}, []);
	return (
		<header className="text-gray-400 bg-gray-900 body-font">
			<div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
				{!!user && (
					<Link href="/messages">
						<FaInbox className="mr-5 hover:text-white cursor-pointer w-12 h-12" />
					</Link>
				)}
				<nav className=" md:ml-auto flex flex-wrap items-center text-base justify-center [&>a]:cursor-pointer">
					<Link href="/#about">
						<a className="mr-5 hover:text-white">About</a>
					</Link>
					<Link
						href="/projects"
						id="feedbackButton"
						className="feedbackButton"
					>
						<a className="mr-5 hover:text-white">Projects</a>
					</Link>

					<Link href="/blog">
						<a className="mr-5 hover:text-white">Blog</a>
					</Link>
				</nav>
				<button className="inline-flex items-center bg-blue-700 border-0 py-1 px-3 focus:outline-none hover:bg-blue-400 rounded text-white mt-4 md:mt-0">
					<Link href="#contact">
						<a>Contact</a>
					</Link>
				</button>
			</div>
		</header>
	);
};

export default Header;
