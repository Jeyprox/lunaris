import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { HiMenuAlt3 } from "react-icons/hi";

import { Link as ScrollLink } from "react-scroll";

const MainNav = ({ cities, cityName, cityColour, openApplication }) => {
  const convertName = (cityName) => {
    return cityName.toLowerCase().replace(/\ /g, "-");
  };

  return (
    <nav className="relative container mx-auto py-6">
      <div className="flex items-center">
        <ul className="select-none w-full flex justify-center items-center gap-x-16 text-xl font-serif uppercase">
          <li
            onClick={openApplication}
            className="cursor-pointer hover:text-gray-500 duration-200"
          >
            Apply
          </li>
          <li className="cursor-not-allowed hover:text-gray-500 duration-200">
            Merchants
          </li>
          <li
            className={`font-sans text-center text-3xl font-bold px-12 select-none text-[${cityColour}]`}
          >
            {cityName}
          </li>
          <li className="hover:text-gray-500 duration-200">
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
          <li className="hover:text-gray-500 duration-200">
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
        </ul>
        {cities && (
          <Menu>
            <Menu.Button aria-label="city select button">
              <HiMenuAlt3 className="text-3xl text-gray-800" />
            </Menu.Button>
            <Transition
              enter="duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="z-10 absolute w-2/3 left-1/2 -translate-x-1/2 top-full bg-gray-200 px-8 py-4 rounded-b-md flex justify-around">
                {cities.map((cityItem) => (
                  <Menu.Item key={cityItem.id}>
                    <Link href={`/cities/${convertName(cityItem.cityName)}`}>
                      <a className="text-xl text-gray-700 uppercase font-semibold hover:text-gray-500 duration-200">
                        {cityItem.cityName}
                      </a>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
