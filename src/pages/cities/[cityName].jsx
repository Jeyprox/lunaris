import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import MainNav from "../../components/MainNav";
import { FadeInSection } from "../../components/FadeInSection";
import { CityLink } from "../../components/CityLink";
const Application = dynamic(() => import("../../components/Application"));
const GovernmentPosition = dynamic(() =>
  import("../../components/GovernmentPosition")
);
import {
  getAllCities,
  getAllCityPreviews,
  getCityByName,
} from "../../lib/graphcms";
import { Element, animateScroll } from "react-scroll";
import { RemoveScroll } from "react-remove-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown, HiTag } from "react-icons/hi";

const City = ({ city, moreCities, cities, uuidList }) => {
  const [applicationOpen, setApplicationOpen] = useState(false);
  return (
    <>
      {city && uuidList && (
        <div>
          <section className="h-[60vh] sm:h-[75vh] md:h-[90vh] xl:h-screen">
            <header>
              {cities && (
                <MainNav
                  cityName={city.cityName.toLowerCase()}
                  cityColour={city.cityColour.hex}
                  cities={cities}
                  openApplication={() => setApplicationOpen(true)}
                />
              )}
            </header>
            <div className="relative grid h-4/5 place-content-center">
              <Image
                src={`${city.landingImage.url}`}
                alt={city.landingImage.altText}
                layout="fill"
                className="-z-10 scale-105 select-none object-cover blur-xs brightness-75"
                priority
                quality={60}
              ></Image>
              <div className="z-10 grid h-full gap-2 text-center lg:gap-8">
                <h1 className="text-dynamicTitle font-bold uppercase text-gray-100">
                  {city.landingTitle}
                </h1>
                <h2 className="font-serif text-2xl uppercase text-gray-200 lg:text-4xl">
                  {city.landingSubtitle}
                </h2>
              </div>
            </div>
            <div className="mt-4 grid cursor-pointer place-content-center">
              <div
                onClick={() => animateScroll.scrollTo(750)}
                className={`rounded-full border-2 border-gray-700 p-1.5 duration-100 hover:bg-gray-900/10`}
              >
                <HiChevronDown className="text-2xl text-gray-700" />
              </div>
            </div>
          </section>
          <section>
            <FadeInSection>
              <Element name="about" className="section xl:max-w-7xl">
                <h1 className="section-title">Information</h1>
                <div className="flex flex-wrap gap-8 lg:gap-16">
                  <div>
                    <div className="relative aspect-square h-64 md:h-72 md:w-96">
                      <Image
                        src={`/img/city-images/${city.cityName.toLowerCase()}_map.png`}
                        alt="Map"
                        layout="fill"
                        objectFit="cover"
                        quality={75}
                      ></Image>
                    </div>
                  </div>
                  <div className="flex w-max flex-col gap-y-4">
                    <div className="grid gap-y-4">
                      <div className="flex items-end">
                        <h1 className="text-4xl font-bold uppercase text-gray-800">
                          {city.cityName}
                        </h1>
                        <p className="ml-4 font-serif text-lg uppercase text-gray-600">
                          {city.server}
                        </p>
                      </div>
                      <p className="max-w-[48ch] font-serif text-lg leading-6 text-gray-600">
                        {city.cityDescription}
                      </p>
                    </div>
                    <div className="flex w-fit items-center gap-x-8 border-y border-gray-300 py-4">
                      <div className="flex items-center gap-x-2">
                        <HiTag className="text-gray-600" />
                        <h1 className="text-xl uppercase text-gray-800">
                          Tags
                        </h1>
                      </div>
                      <div className="flex items-center gap-x-2">
                        {city.cityStatus.map((status) => (
                          <p className="tag" key={status}>
                            {status}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="grid w-fit grid-cols-3 items-end gap-x-8 text-center">
                      <div className="grid place-content-center gap-y-2">
                        <h1 className="text-5xl font-semibold text-gray-600">
                          {city.citizenCount}
                        </h1>
                        <p className="font-serif uppercase">Citizens</p>
                      </div>
                      <div className="grid place-content-center gap-y-2">
                        <h1 className="text-4xl font-semibold text-gray-600">
                          {city.cityCoordinates[0]}
                        </h1>
                        <p className="font-serif uppercase">X-COORD</p>
                      </div>
                      <div className="grid place-content-center gap-y-2">
                        <h1 className="text-4xl font-semibold text-gray-600">
                          {city.cityCoordinates[1]}
                        </h1>
                        <p className="font-serif uppercase">Y-COORDS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Element>
            </FadeInSection>
          </section>
          <section>
            <FadeInSection>
              <Element className="section xl:max-w-7xl" name="government">
                <h1 className="section-title">Government Positions</h1>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {city.governmentPositions.map((player, index) => (
                    <GovernmentPosition
                      key={index}
                      player={player}
                      colour={city.cityColour.hex}
                      uuid={uuidList[index]}
                    />
                  ))}
                </div>
              </Element>
            </FadeInSection>
          </section>
          {moreCities.length > 0 && (
            <section>
              <FadeInSection>
                <div className="section xl:max-w-4xl">
                  <h1 className="section-title">Other cities</h1>
                  <div className="grid grid-cols-1 justify-center justify-items-center gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {moreCities.map((city) => (
                      <CityLink key={city.cityName} city={city} />
                    ))}
                  </div>
                </div>
              </FadeInSection>
            </section>
          )}
          <AnimatePresence>
            {applicationOpen && (
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <RemoveScroll forwardProps>
                  <div className="scroll-wheel absolute inset-x-1/2 top-12 z-30 h-[90vh] w-4/5 -translate-x-1/2 overflow-y-scroll overscroll-contain rounded-md bg-gray-200 px-8 md:w-2/3 lg:w-3/5 xl:w-2/5">
                    <Application
                      closeApplication={() =>
                        setApplicationOpen(!applicationOpen)
                      }
                      cities={cities}
                      currentCity={city.cityName}
                    />
                  </div>
                </RemoveScroll>
                <span
                  onClick={() => setApplicationOpen(false)}
                  className="absolute inset-0 z-20 bg-gray-900/40"
                ></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const cityName = params.cityName
    .replace("-", " ")
    .replace(/(\b[a-z](?!\s))/g, (x) => x.toUpperCase());
  const data = await getCityByName(cityName);

  const uuidList = await Promise.all(
    data.city.governmentPositions.map(async ({ ign }) => {
      const res = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${ign}`
      );
      const userData = await res.json();
      return userData.id;
    })
  );

  const cities = await getAllCityPreviews();

  return {
    props: {
      city: data.city,
      moreCities: data.moreCities,
      cities,
      uuidList,
    },
  };
};

export const getStaticPaths = async () => {
  let cities = await getAllCities();
  const cityNames = cities.map(({ cityName }) => {
    const newName = cityName.toLowerCase().replace(/\ /g, "-");
    return { params: { cityName: newName } };
  });
  return {
    paths: cityNames,
    fallback: true,
  };
};

export default City;
