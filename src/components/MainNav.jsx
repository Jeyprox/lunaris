import Link from "next/link";

import { Link as ScrollLink } from "react-scroll";

const MainNav = ({ cityName, cityColour }) => {
  return (
    <nav className="container mx-auto py-6">
      <ul className="flex justify-center items-center text-xl font-serif uppercase">
        <li className="px-8 py-1 hover:text-gray-500 duration-200">
          <Link
            href={{
              pathname: "/cities/apply",
              query: { cityOrigin: cityName },
            }}
          >
            Join Us
          </Link>
        </li>
        <li className="px-8 py-1 hover:text-gray-500 duration-200">
          <Link href={`/shop/${cityName}`}>Merchants</Link>
        </li>
        <li
          className={`font-sans text-3xl font-bold px-32 select-none text-[${cityColour}]`}
        >
          {cityName}
        </li>
        <li className="px-8 py-1 hover:text-gray-500 duration-200">
          <ScrollLink
            to="about"
            smooth={true}
            duration={1000}
            offset={-100}
            className="cursor-pointer"
          >
            About
          </ScrollLink>
        </li>
        <li className="px-8 py-1 hover:text-gray-500 duration-200">
          <ScrollLink
            to="government"
            smooth={true}
            duration={1000}
            offset={-100}
            className="cursor-pointer"
          >
            Government
          </ScrollLink>
        </li>
        {/* {navList.map((navItem, index) => (
          <li
            className={`${
              index == 2
                ? "font-sans text-3xl font-bold px-32"
                : "text-xl font-serif hover:text-gray-500"
            } text-gray-900 uppercase  duration-200 px-8 py-1`}
            key={navItem}
          >
            <ScrollLink
              href={
                index == 2
                  ? `/cities/${navItem}`
                  : `/${cityName}/${navItem.replace(/\ /g, "-")}`
              }
            >
              {navItem}
            </ScrollLink>
          </li>
        ))} */}
        <li></li>
      </ul>
    </nav>
  );
};

export default MainNav;
