import Image from "next/image";
import ErrorPage from "next/error";
import {
  HiChevronDown,
  HiLocationMarker,
  HiMap,
  HiPencil,
  HiTag,
} from "react-icons/hi";
import { FaDiscord } from "react-icons/fa";
import { RiGovernmentFill } from "react-icons/ri";
import MainNav from "../../components/MainNav";
import { getAllCities, getCityByName } from "../../lib/graphcms";
import Link from "next/link";
import { Element, animateScroll } from "react-scroll";
import { useEffect, useRef } from "react";
import { FXAASkinViewer, IdleAnimation } from "skinview3d";

const City = ({ city, moreCities }) => {
  const skinRef = useRef([]);

  useEffect(() => {
    if (!city) return;
    city.governmentPositions.forEach((player, index) => {
      const getSkinViewer = (canvas, playerName) => {
        let skinViewer = new FXAASkinViewer({
          canvas,
          width: 144,
          height: 196,
          background: city.cityColour.hex,
          skin: `https://minotar.net/skin/${playerName}`,
        });
        skinViewer.animations.add(IdleAnimation);
      };
      getSkinViewer(skinRef.current[index], player.ingameName);
    });
  }, [city]);

  const getMapUrl = (server) => {
    switch (server) {
      case "Rathnir":
        return "http://199.127.63.89:2096/";
      case "Eldham":
        return "http://104.238.222.67:2096/";
    }
  };

  return (
    <>
      {city && (
        <div>
          <section className="w-screen h-[100vh]">
            <header>
              <MainNav
                cityName={city.cityName.toLowerCase()}
                cityColour={city.cityColour.hex}
              />
            </header>
            <div className="relative h-4/5">
              <div className="-z-10 overflow-hidden absolute w-full h-full">
                <Image
                  src={city.landingImage.url}
                  alt="City Landing"
                  layout="fill"
                  className="object-cover blur-xs brightness-75 scale-105"
                ></Image>
              </div>
              <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-gray-100 text-8xl font-bold uppercase mb-8">
                  {city.landingTitle}
                </h1>
                <h2 className="text-gray-200 font-serif text-4xl uppercase">
                  {city.landingSubtitle}
                </h2>
              </div>
            </div>
            <div className="cursor-pointer flex w-full justify-center items-center p-2 mt-4">
              <div
                onClick={() => animateScroll.scrollTo(750)}
                className={`p-1.5 border-2 border-gray-700 hover:bg-gray-900/10 duration-200 rounded-full`}
              >
                <HiChevronDown className="text-2xl text-gray-700" />
              </div>
            </div>
          </section>
          <section className="section xl:max-w-7xl mt-32">
            <Element name="about" className="flex">
              <div>
                <iframe
                  src={`${getMapUrl(city.server)}?worldname=${
                    city.server
                  }&mapname=surface&zoom=4&x=${city.cityCoordinates[0]}&z=${
                    city.cityCoordinates[1]
                  }`}
                  width={500}
                  height={500}
                  frameBorder="0"
                  allowFullScreen={false}
                ></iframe>
              </div>
              <div className="ml-16 w-full flex flex-col divide-y divide-gray-300">
                <div className="pb-4">
                  <div className="flex items-end mb-4">
                    <h1 className="text-4xl uppercase text-gray-800 font-bold">
                      {city.cityName}
                    </h1>
                    <p className="ml-4 text-gray-500 text-lg font-serif uppercase">
                      {city.server}
                    </p>
                  </div>
                  <p className="text-gray-600 text-lg font-serif leading-6 max-w-[48ch]">
                    {city.cityDescription}
                  </p>
                </div>
                <div className="grid grid-cols-4 w-4/5 items-end pt-4 gap-x-2">
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-semibold text-gray-500">
                      {city.citizenCount}
                    </h1>
                    <p className="mt-2 uppercase font-serif">Citizens</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="flex flex-col items-center font-semibold text-gray-500 uppercase">
                      {city.cityStatus.map((status) => (
                        <span key={status}>{status}</span>
                      ))}
                    </h1>
                    <p className="mt-2 uppercase font-serif">Tags</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-semibold text-gray-500">
                      {city.cityCoordinates[0]}
                    </h1>
                    <p className="mt-2 uppercase font-serif">X-COORD</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-semibold text-gray-500">
                      {city.cityCoordinates[1]}
                    </h1>
                    <p className="mt-2 uppercase font-serif">Y-COORDS</p>
                  </div>
                </div>
              </div>
            </Element>
          </section>
          <section className="section">
            <Element name="government">
              <h1 className="section-title">Government Positions</h1>
              <div className="grid grid-cols-2">
                {city.governmentPositions.map((player, index) => (
                  <div className="flex mx-2" key={player.userId}>
                    <div className="overflow-hidden rounded-md">
                      <canvas
                        ref={(el) => (skinRef.current[index] = el)}
                      ></canvas>
                    </div>
                    <div className="ml-8 grid grid-cols-3 gap-y-2 gap-x-4 place-content-center">
                      <div className="flex items-center">
                        <HiTag className="text-xl text-gray-500 mr-2" />
                        <p className="text-lg uppercase">IGN</p>
                      </div>
                      <h1 className="text-2xl col-span-2 text-gray-900 font-semibold uppercase">
                        {player.ingameName}
                      </h1>
                      <div className="flex items-center">
                        <FaDiscord className="text-xl text-gray-500 mr-2" />
                        <p className="text-lg uppercase">Discord</p>
                      </div>
                      <h2 className="tag w-min col-span-2">
                        {player.discordName}
                      </h2>
                      <div className="flex items-center">
                        <RiGovernmentFill className="text-xl text-gray-500 mr-2" />
                        <p className="text-lg uppercase">Government</p>
                      </div>
                      <h2 className="tag w-min col-span-2">
                        {player.governmentPosition}
                      </h2>
                      {player.ministerPosition && (
                        <div className="flex items-center">
                          <HiPencil className="text-xl text-gray-500 mr-2" />
                          <p className="text-lg uppercase">Ministry</p>
                        </div>
                      )}
                      {player.ministerPosition && (
                        <h2 className="tag w-min col-span-2">
                          {player.ministerPosition}
                        </h2>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Element>
          </section>
          {moreCities.length > 0 && (
            <section className="section ">
              <h1 className="section-title">Other cities</h1>
              <div className="grid grid-cols-3 justify-center justify-items-center">
                {moreCities.map((city) => (
                  <Link
                    key={city.cityName}
                    href={`/cities/${city.cityName}`}
                    passHref
                  >
                    <div className="cursor-pointer p-4 rounded-md flex items-center border-2 hover:bg-gray-300/10">
                      <div>
                        <div className="relative w-32 h-32">
                          <Image
                            src={city.cityMap.url}
                            alt={`${city.cityName} Map`}
                            layout="fill"
                            objectFit="contain"
                          ></Image>
                        </div>
                      </div>
                      <div className="ml-6">
                        <div>
                          <span
                            className={`w-10 h-10 rounded-full bg-blue-300`}
                          ></span>
                          <h1 className="text-2xl font-serif uppercase text-gray-900">
                            {city.cityName}
                          </h1>
                        </div>
                        <div className="mt-2 flex flex-col items-start">
                          <div className="flex items-center">
                            <HiLocationMarker className="text-gray-500" />
                            <p className="text-gray-500 text-base ml-1">
                              X: {city.cityCoordinates[0]} | Y:
                              {city.cityCoordinates[1]}
                            </p>
                          </div>

                          <div className="flex items-center mt-1">
                            <HiMap className="text-gray-500" />
                            <p className="text-gray-500 ml-1">{city.server}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
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

  for await (const player of data.city.governmentPositions) {
    const res = await fetch(
      `https://playerdb.co/api/player/minecraft/${player.ingameName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const userId = await res.json();
    player.userId = userId.data.player.id;
  }

  return {
    props: {
      city: data.city,
      moreCities: data.moreCities,
    },
  };
};

export const getStaticPaths = async () => {
  const cities = await getAllCities();
  return {
    paths: cities.map(({ cityName }) => ({
      params: { cityName },
    })),
    fallback: true,
  };
};

export default City;
