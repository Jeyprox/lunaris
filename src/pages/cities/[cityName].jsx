import Image from "next/image";
import {
  HiChevronDown,
  HiLocationMarker,
  HiMap,
  HiPencilAlt,
  HiTag,
} from "react-icons/hi";
import { FaDiscord } from "react-icons/fa";
import { RiGovernmentFill } from "react-icons/ri";
import MainNav from "../../components/MainNav";
import {
  getAllCities,
  getAllCityPreviews,
  getCityByName,
} from "../../lib/graphcms";
import Link from "next/link";
import { Element, animateScroll } from "react-scroll";
import { Fragment, useEffect, useRef, useState } from "react";
import { FXAASkinViewer, IdleAnimation } from "skinview3d";
import Application from "../../components/Application";
import { RemoveScroll } from "react-remove-scroll";
import { AnimatePresence, motion } from "framer-motion";

const City = ({ city, moreCities, cities }) => {
  const skinRef = useRef([]);
  // const [mapLoaded, setMapLoaded] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);

  useEffect(() => {
    if (!city) return;
    city.governmentPositions.forEach((player, index) => {
      const getSkinViewer = (canvas, playerName) => {
        let skinViewer = new FXAASkinViewer({
          canvas,
          width: 121,
          height: 169,
          background: city.cityColour.hex,
          skin: `https://minotar.net/skin/${playerName}`,
        });
        skinViewer.animations.add(IdleAnimation);
      };
      getSkinViewer(skinRef.current[index], player.ign);
    });
  }, [city]);

  return (
    <>
      {city && (
        <div>
          <section className="h-[75vh] xl:h-screen">
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
            <div className="relative h-4/5 grid place-content-center">
              <Image
                src={`${city.landingImage.url}`}
                alt={city.landingImage.altText}
                layout="fill"
                className="-z-10 select-none object-cover blur-xs brightness-75 scale-105"
                priority
                quality={60}
              ></Image>
              <div className="z-10 h-full grid text-center gap-2 lg:gap-8">
                <h1 className="text-gray-100 text-dynamicTitle font-bold uppercase">
                  {city.landingTitle}
                </h1>
                <h2 className="text-gray-200 font-serif text-2xl lg:text-4xl uppercase">
                  {city.landingSubtitle}
                </h2>
              </div>
            </div>
            <div className="cursor-pointer grid place-content-center mt-4">
              <div
                onClick={() => animateScroll.scrollTo(750)}
                className={`p-1.5 border-2 border-gray-700 hover:bg-gray-900/10 duration-100 rounded-full`}
              >
                <HiChevronDown className="text-2xl text-gray-700" />
              </div>
            </div>
          </section>
          <section className="section xl:max-w-7xl">
            <h1 className="section-title">Information</h1>
            <Element name="about" className="flex flex-wrap gap-16 md:gap-8">
              <div>
                <div className="relative w-96 h-72">
                  <Image
                    src={`/img/city-images/${city.cityName.toLowerCase()}_map.png`}
                    alt="Map"
                    layout="fill"
                    objectFit="cover"
                    quality={75}
                  ></Image>
                </div>
              </div>
              <div className="w-max flex flex-col gap-y-4">
                <div className="grid gap-y-4">
                  <div className="flex items-end">
                    <h1 className="text-4xl uppercase text-gray-800 font-bold">
                      {city.cityName}
                    </h1>
                    <p className="ml-4 text-gray-600 text-lg font-serif uppercase">
                      {city.server}
                    </p>
                  </div>
                  <p className="text-gray-600 text-lg font-serif leading-6 max-w-[48ch]">
                    {city.cityDescription}
                  </p>
                </div>
                <div className="flex items-center py-4 w-fit gap-x-8 border-y border-gray-300">
                  <div className="flex gap-x-2 items-center">
                    <HiTag className="text-gray-600" />
                    <h1 className="text-xl text-gray-800 uppercase">Tags</h1>
                  </div>
                  <div className="flex gap-x-2 items-center">
                    {city.cityStatus.map((status) => (
                      <p className="tag" key={status}>
                        {status}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 w-fit items-end gap-x-8 text-center">
                  <div className="grid place-content-center gap-y-2">
                    <h1 className="text-5xl font-semibold text-gray-600">
                      {city.citizenCount}
                    </h1>
                    <p className="uppercase font-serif">Citizens</p>
                  </div>
                  <div className="grid place-content-center gap-y-2">
                    <h1 className="text-4xl font-semibold text-gray-600">
                      {city.cityCoordinates[0]}
                    </h1>
                    <p className="uppercase font-serif">X-COORD</p>
                  </div>
                  <div className="grid place-content-center gap-y-2">
                    <h1 className="text-4xl font-semibold text-gray-600">
                      {city.cityCoordinates[1]}
                    </h1>
                    <p className="uppercase font-serif">Y-COORDS</p>
                  </div>
                </div>
              </div>
            </Element>
          </section>
          <Element className="section xl:max-w-7xl" name="government">
            <h1 className="section-title">Government Positions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {city.governmentPositions.map((player, index) => (
                <div
                  className="flex flex-col sm:flex-row items-center gap-4"
                  key={index}
                >
                  <div className="flex-none">
                    <canvas
                      className="rounded"
                      ref={(el) => (skinRef.current[index] = el)}
                    ></canvas>
                  </div>
                  <div className="w-fit grid grid-cols-3 gap-y-2 gap-x-4 items-start">
                    {Object.entries(player).map(
                      ([key, value]) =>
                        value && (
                          <Fragment key={key}>
                            <div className="flex items-center gap-2 py-1">
                              {key === "ign" ? (
                                <HiTag className="text-xl text-gray-500 flex-none" />
                              ) : key === "discord" ? (
                                <FaDiscord className="text-xl text-gray-500 flex-none" />
                              ) : key === "govPos" ? (
                                <HiPencilAlt className="text-xl text-gray-500 flex-none" />
                              ) : (
                                <RiGovernmentFill className="text-xl text-gray-500 flex-none" />
                              )}

                              <p className="text-lg uppercase">
                                {key.toUpperCase()}
                              </p>
                            </div>
                            <div className="col-span-2 flex flex-wrap gap-2">
                              {key === "govPos" ? (
                                value.map((item, i) => (
                                  <h2 key={i} className="tag">
                                    {item.replace(new RegExp("_", "g"), " ")}
                                  </h2>
                                ))
                              ) : key === "ign" ? (
                                <h1 className="text-xl xl:text-2xl col-span-2 text-gray-900 font-semibold uppercase">
                                  {value}
                                </h1>
                              ) : (
                                <h2 className="tag w-fit col-span-2">
                                  {value}
                                </h2>
                              )}
                            </div>
                          </Fragment>
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Element>
          {moreCities.length > 0 && (
            <section className="section xl:max-w-4xl">
              <h1 className="section-title">Other cities</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 justify-center justify-items-center">
                {moreCities.map((city) => (
                  <Link
                    key={city.cityName}
                    href={`/cities/${city.cityName}`}
                    passHref
                  >
                    <div className="cursor-pointer w-full p-4 rounded-md grid gap-y-2 justify-center border-2 hover:bg-gray-300/10">
                      <div className="mx-auto relative aspect-square h-24">
                        <Image
                          src={city.cityMap.url}
                          alt={`${city.cityName} Map`}
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                      <div className="grid">
                        <h1 className="text-2xl text-center font-serif uppercase text-gray-900 mb-1">
                          {city.cityName}
                        </h1>
                        <div className="flex items-center">
                          <HiLocationMarker className="text-gray-500" />
                          <p className="text-gray-600 text-base ml-1">
                            X: {city.cityCoordinates[0]} | Y:
                            {city.cityCoordinates[1]}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <HiMap className="text-gray-500" />
                          <p className="text-gray-600 ml-1">{city.server}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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
                  <div className="z-20 scroll-wheel overscroll-contain absolute bg-gray-200 h-[90vh] overflow-y-scroll top-12 inset-x-1/2 -translate-x-1/2 w-4/5 md:w-2/3 lg:w-3/5 xl:w-2/5 px-8 rounded-md">
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
                  className="absolute z-10 inset-0 bg-gray-900/40"
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

  const cities = await getAllCityPreviews();

  return {
    props: {
      city: data.city,
      moreCities: data.moreCities,
      cities,
    },
  };
};

export const getStaticPaths = async () => {
  let cities = await getAllCities();
  return {
    paths: cities.map(({ cityName }) => ({
      params: { cityName },
    })),
    fallback: true,
  };
};

export default City;
