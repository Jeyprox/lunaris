import Link from "next/link";

import { Menu, Popover, Transition } from "@headlessui/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link as ScrollLink } from "react-scroll";
import { RemoveScroll } from "react-remove-scroll";

const MainNav = ({ cities, cityName, cityColour, openApplication }) => {
  const convertName = (cityName) => {
    return cityName.toLowerCase().replace(/\ /g, "-");
  };

  return (
    <nav className="container mx-auto py-6 px-2 lg:relative">
      <div className="flex items-center justify-between">
        <ul className="flex w-full select-none items-center gap-8 font-serif text-xl uppercase lg:justify-center xl:gap-16">
          <li
            onClick={openApplication}
            className="hidden cursor-pointer duration-200 hover:text-gray-500 lg:block"
          >
            Apply
          </li>
          <li className="hidden cursor-not-allowed duration-200 hover:text-gray-500 lg:block">
            Merchants
          </li>
          <li
            className={`px:8 select-none text-center font-sans text-2xl font-bold text-gray-800 lg:text-3xl xl:px-16`}
          >
            {cityName}
          </li>
          <li className="hidden duration-200 hover:text-gray-500 lg:block">
            <ScrollLink
              to="about"
              smooth={true}
              duration={1000}
              offset={-50}
              className="cursor-pointer"
            >
              About
            </ScrollLink>
          </li>
          <li className="hidden duration-200 hover:text-gray-500 lg:block">
            <ScrollLink
              to="government"
              smooth={true}
              duration={1000}
              offset={-50}
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
                <Menu.Items className="absolute left-1/2 top-full z-10 flex w-2/3 -translate-x-1/2 justify-around rounded-b-md bg-gray-200 px-8 py-4">
                  {cities.map((cityItem) => (
                    <Menu.Item key={cityItem.id}>
                      <Link href={`/cities/${convertName(cityItem.cityName)}`}>
                        <a className="text-xl font-semibold uppercase text-gray-700 duration-200 hover:text-gray-500">
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
                      open ? "fixed inset-0 opacity-30" : "opacity-0"
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
                        className="absolute right-0 top-0 z-20 h-screen w-4/5 bg-gray-100 p-12 md:w-2/5"
                      >
                        <Popover.Button className="absolute top-6 right-8 grid h-10 w-10 cursor-pointer place-content-center rounded-full border-2 border-gray-500">
                          <HiX className="text-2xl text-gray-500" />
                        </Popover.Button>
                        <div className="grid h-full items-center gap-8 text-center uppercase">
                          <div className="grid gap-4">
                            <h2 className="text-3xl font-semibold">
                              Navigation
                            </h2>
                            <ul className="flex flex-col gap-2 font-serif text-xl">
                              <li
                                onClick={openApplication}
                                className="cursor-pointer duration-200 hover:text-gray-500"
                              >
                                Apply
                              </li>
                              <li className="cursor-not-allowed duration-200 hover:text-gray-500">
                                Merchants
                              </li>
                              <li className="duration-200 hover:text-gray-500">
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
                              <li className="duration-200 hover:text-gray-500">
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
                                    <a className="text-xl duration-200 hover:text-gray-500">
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
