import Image from "next/image";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import CityItem from "../components/CityItem";

import { HiArrowSmLeft, HiChevronDown } from "react-icons/hi";
import Link from "next/link";
import { getAllCityPreviews } from "../lib/graphcms";
import { Listbox } from "@headlessui/react";

export default function Home({ cities }) {
  const [landing, setLanding] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  const getCityById = (cityId) => {
    if (cityId == null) return { cityName: "" };
    const city = cities.find((city) => city.id == cityId);
    if (city !== null) return city;
    return { cityName: "" };
  };

  const convertName = (cityName) => {
    return cityName.toLowerCase().replace(/\ /g, "-");
  };

  return (
    <>
      <section className="relative flex h-screen flex-col items-center justify-between gap-4 py-4">
        <div className="z-10 grid gap-2 divide-y-2 divide-gray-200 text-center">
          <h1 className="px-8 text-3xl font-bold uppercase text-gray-200">
            Lunari Empire
          </h1>
          <h2 className="pt-2 font-serif text-4xl uppercase text-gray-100">
            Nation of the Moon
          </h2>
        </div>
        <motion.div
          className="z-10 grid w-full items-center gap-4 px-4 md:gap-16"
          layout
          transition={{ duration: 1 }}
        >
          <motion.h1
            layout
            className="text-center text-dynamicTitle font-semibold uppercase text-gray-100"
          >
            Ready for
            <br />
            an adventure?
          </motion.h1>
          {!landing && (
            <motion.div
              layout
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 50, opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative mx-auto w-fit"
            >
              <Listbox
                as="div"
                className="relative mb-24 md:hidden"
                value={selectedCity}
                onChange={setSelectedCity}
              >
                <Listbox.Button className="flex w-80 items-center justify-between border-2 border-gray-200 px-2 py-1.5 text-left font-serif text-xl text-gray-200">
                  {getCityById(selectedCity).cityName || "Select a city"}
                  <HiChevronDown />
                </Listbox.Button>
                <Listbox.Options
                  as="ul"
                  className="top-100 absolute mt-1 max-h-40 w-full overflow-y-scroll border-2 border-gray-200 bg-gray-200/25"
                >
                  {cities.map((city) => (
                    <Listbox.Option
                      as="li"
                      className="flex items-center gap-4 px-2 py-1 font-serif"
                      key={city.id}
                      value={city.id}
                    >
                      <div className="relative aspect-square w-10">
                        <Image
                          src={city.cityMap.url}
                          alt={city.cityMap.altText}
                          layout="fill"
                          objectFit="contain"
                          quality={75}
                        />
                      </div>
                      <h1 className="text-gray-200">{city.cityName}</h1>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
              <div className="hidden grid-cols-4 gap-4 md:grid">
                {cities.map((city) => (
                  <div
                    key={city.cityName}
                    onClick={() => setSelectedCity(city.id)}
                  >
                    <CityItem
                      name={city.cityName}
                      mapUrl={city.cityMap.url}
                      isSelected={selectedCity == city.id}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
        <div className="z-10 mb-8">
          {landing && (
            <button onClick={() => setLanding(false)} className="btn text-2xl">
              Start the journey
            </button>
          )}
          {!landing && (
            <button
              className="btn text-2xl hover:bg-gray-200/25 disabled:cursor-not-allowed"
              disabled={selectedCity == null}
            >
              {selectedCity == null ? (
                <p>Select a city</p>
              ) : (
                <Link
                  href={`/cities/${convertName(
                    getCityById(selectedCity).cityName
                  )}`}
                >
                  <a>Go to {getCityById(selectedCity).cityName}</a>
                </Link>
              )}
            </button>
          )}
        </div>
        <Image
          src="/img/landing.png"
          alt="LandingImg-1"
          layout="fill"
          className="-z-10 scale-105 select-none object-cover blur-xs brightness-110 contrast-[0.8] saturate-[1.1]"
          priority
          objectFit="cover"
          quality={75}
        />
        <div className="absolute bottom-6 z-10 hidden w-full px-8 md:flex">
          <AnimatePresence>
            {!landing && (
              <motion.button
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLanding(true)}
                className="rounded-full border-2 border-gray-300 p-1 duration-200 hover:bg-gray-100/20"
                aria-label="Go Back"
              >
                <HiArrowSmLeft className="text-2xl text-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getAllCityPreviews();
  return {
    props: {
      cities: data,
    },
  };
};
