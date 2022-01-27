import Image from "next/image";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import CityItem from "../components/CityItem";

import { HiArrowSmLeft } from "react-icons/hi";
import Link from "next/link";
import { getAllCityPreviews } from "../lib/graphcms";

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
      <section className="relative h-screen py-4 flex flex-col gap-4 justify-between items-center">
        <div className="z-10 grid gap-2 text-center">
          <h1 className="text-gray-100 px-8 text-3xl font-bold uppercase border-b-gray-100 border-b-2">
            Lunari Empire
          </h1>
          <h2 className="font-serif uppercase text-gray-100 text-4xl">
            Nation of the Moon
          </h2>
        </div>
        <motion.div
          className="z-10 grid w-1/2 items-center gap-16"
          layout
          transition={{ duration: 1 }}
        >
          <motion.h1
            layout
            className="uppercase text-gray-100 text-7xl font-semibold text-center"
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
              className="relative flex items-center justify-center gap-4"
            >
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
              className="btn text-2xl disabled:cursor-not-allowed hover:bg-gray-200/25"
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
          className="-z-10 select-none object-cover contrast-[0.8] saturate-[1.1] brightness-110 blur-xs scale-105"
          priority
          quality={75}
        ></Image>
        <div className="z-10 absolute bottom-6 w-full px-8 flex">
          <AnimatePresence>
            {!landing && (
              <motion.button
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                onClick={() => setLanding(true)}
                className="border-gray-300 border-2 rounded-full p-1 hover:bg-gray-100/20 duration-200"
                aria-label="Go Back"
              >
                <HiArrowSmLeft className="text-gray-300 text-2xl" />
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
