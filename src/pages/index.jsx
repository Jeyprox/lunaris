import Image from "next/image";

import { useState } from "react";

import { motion } from "framer-motion";
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
      <section className="h-screen container mx-auto p-4 flex flex-col justify-between items-center">
        <div className="z-10 flex flex-col items-center justify-center">
          <h1 className="text-gray-100 px-8 text-3xl font-bold uppercase border-b-gray-100 border-b-2">
            Lunari Empire
          </h1>
          <h2 className="font-serif mt-2 uppercase text-gray-100 text-4xl">
            Nation of the Moon
          </h2>
        </div>
        <motion.div
          className="grid w-1/2 items-center gap-16"
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
        <div className="mb-8">
          <div className="mb-2"></div>
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
              <Link
                href={`/cities/${convertName(
                  getCityById(selectedCity).cityName
                )}`}
              >
                {selectedCity == null
                  ? "Select a city"
                  : `Go to ${getCityById(selectedCity).cityName}`}
              </Link>
            </button>
          )}
        </div>
        <div className="overflow-hidden -z-10 top-0 left-0 absolute select-none w-screen h-full">
          <Image
            src="/img/landing.png"
            alt="LandingImg-1"
            layout="fill"
            className="object-cover contrast-[0.8] saturate-[1.1] brightness-110 blur-xs scale-105"
            priority
            quality={75}
          ></Image>
        </div>
        {!landing && (
          <div className="absolute bottom-6 w-full px-8 flex">
            <motion.button
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLanding(true)}
              className="border-gray-300 border-2 rounded-full p-1 hover:bg-gray-100/20 duration-200"
            >
              <HiArrowSmLeft className="text-gray-300 text-2xl" />
            </motion.button>
          </div>
        )}
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
