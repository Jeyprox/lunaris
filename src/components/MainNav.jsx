import { Menu, Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import { Link as ScrollLink } from "react-scroll";

import { RemoveScroll } from "react-remove-scroll";

const MainNav = ({ cities, cityName, cityColour, openApplication }) => {
  const convertName = (cityName) => {
    return cityName.toLowerCase().replace(/\ /g, "-");
  };

  return (
    <nav className="lg:relative container mx-auto py-6 px-2">
      <div className="flex justify-between items-center">
        <ul className="select-none w-full flex lg:justify-center items-center gap-8 xl:gap-16 text-xl font-serif uppercase">
          <li
            onClick={openApplication}
            className="hidden lg:block cursor-pointer hover:text-gray-500 duration-200"
          >
            Apply
          </li>
          <li className="hidden lg:block cursor-not-allowed hover:text-gray-500 duration-200">
            Merchants
          </li>
          <li
            className={`font-sans text-center text-2xl lg:text-3xl font-bold px:8 xl:px-16 select-none text-[${cityColour}]`}
          >
            {cityName}
          </li>
          <li className="hidden lg:block hover:text-gray-500 duration-200">
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
          <li className="hidden lg:block hover:text-gray-500 duration-200">
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
          <>
            <Menu as="div" className="hidden lg:flex">
              <Menu.Button
                className="absolute top-1/2 right-4 -translate-y-1/2"
                aria-label="city selector"
              >
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
            <Popover as="div" className="flex lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button aria-label="city navigation">
                    <HiMenuAlt3 className="text-3xl text-gray-800" />
                  </Popover.Button>
                  <Popover.Overlay
                    className={`${
                      open ? "opacity-30 fixed inset-0" : "opacity-0"
                    } bg-black`}
                  />
                  <Transition
                    enter="duration-500 z-20 right-0 top-0"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <RemoveScroll>
                      <Popover.Panel
                        as="div"
                        className="z-20 absolute right-0 top-0 h-screen bg-gray-100 w-4/5 md:w-2/5 p-12"
                      >
                        <Popover.Button className="absolute top-6 right-8 grid place-content-center cursor-pointer w-10 h-10 rounded-full border-gray-500 border-2">
                          <HiX className="text-2xl text-gray-500" />
                        </Popover.Button>
                        <div className="h-full grid gap-8 uppercase items-center text-center">
                          <div className="grid gap-4">
                            <h2 className="text-3xl font-semibold">
                              Navigation
                            </h2>
                            <ul className="flex flex-col gap-2 font-serif text-xl">
                              <li
                                onClick={openApplication}
                                className="cursor-pointer hover:text-gray-500 duration-200"
                              >
                                Apply
                              </li>
                              <li className="cursor-not-allowed hover:text-gray-500 duration-200">
                                Merchants
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
                          </div>
                          <div className="grid gap-4">
                            <h2 className="text-3xl font-semibold">Cities</h2>
                            <ul className="flex flex-col gap-2 font-serif text-gray-700">
                              {cities.map((cityItem) => (
                                <li key={cityItem.id}>
                                  <Link
                                    href={`/cities/${convertName(
                                      cityItem.cityName
                                    )}`}
                                  >
                                    <a className="text-xl hover:text-gray-500 duration-200">
                                      {cityItem.cityName}
                                    </a>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Popover.Panel>
                    </RemoveScroll>
                  </Transition>
                </>
              )}
            </Popover>
          </>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
