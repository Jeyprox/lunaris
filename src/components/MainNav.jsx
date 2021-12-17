import Link from "next/link";
import { useRouter } from "next/router";

const MainNav = (cityName) => {
  const navList = [
    "Join Us",
    "Merchants",
    cityName.cityName,
    "Government",
    "About",
  ];

  return (
    <nav className="container mx-auto py-6">
      <ul className="flex justify-center items-center">
        {navList.map((navItem, index) => (
          <li
            className={`${
              index == 2
                ? "font-sans text-3xl font-bold px-32"
                : "text-xl font-serif hover:text-gray-500"
            } text-gray-900 uppercase  duration-200 px-8 py-1`}
            key={navItem}
          >
            <Link
              href={`/${
                index == 2
                  ? `/cities/${navItem.toLowerCase()}`
                  : navItem.replace(/\ /g, "-").toLowerCase()
              }`}
            >
              {navItem}
            </Link>
          </li>
        ))}
        <li></li>
      </ul>
    </nav>
  );
};

export default MainNav;
