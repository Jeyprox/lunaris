import Image from "next/image";
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
import { useEffect, useState, useRef } from "react";
import { FXAASkinViewer, IdleAnimation } from "skinview3d";

const City = ({ city, moreCities, cities }) => {
  const skinRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

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
              {cities && (
                <MainNav
                  cityName={city.cityName.toLowerCase()}
                  cityColour={city.cityColour.hex}
                  cities={cities}
                />
              )}
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
          <section className="section xl:max-w-7xl">
            <h1 className="section-title">Information</h1>
            <Element name="about" className="flex gap-x-16">
              <div>
                {!mapLoaded && (
                  <div className="relative w-[600px] h-[400px]">
                    <Image
                      src="/img/city-images/lunaris/NoxMap.png"
                      alt="Map"
                      layout="fill"
                      objectFit="cover"
                    ></Image>
                  </div>
                )}
                <iframe
                  className={!mapLoaded ? "hidden" : ""}
                  src={`${getMapUrl(city.server)}?worldname=${
                    city.server
                  }&mapname=surface&zoom=4&x=${city.cityCoordinates[0]}&z=${
                    city.cityCoordinates[1]
                  }`}
                  width={600}
                  height={400}
                  frameBorder="0"
                  allowFullScreen={false}
                  onLoad={() => setMapLoaded(true)}
                ></iframe>
              </div>
              <div className="w-full flex flex-col divide-y divide-gray-300">
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
          <Element className="section xl:max-w-7xl" name="government">
            <h1 className="section-title">Government Positions</h1>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {city.governmentPositions.map((player, index) => (
                <div className="flex items-center gap-x-4" key={player.userId}>
                  <div className="flex-none overflow-hidden">
                    <canvas
                      className="rounded"
                      ref={(el) => (skinRef.current[index] = el)}
                    ></canvas>
                  </div>
                  <div className="grid grid-cols-3 gap-y-2 gap-x-4 place-content-center">
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
                    <h2 className="tag w-fit col-span-2">
                      {player.discordName}
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
                    <div className="flex items-center">
                      <RiGovernmentFill className="text-xl text-gray-500 mr-2" />
                      <p className="text-lg uppercase">Government</p>
                    </div>
                    <div className="flex flex-wrap gap-2 col-span-2 row-span-2">
                      {player.governmentPositions.map((pos, i) => (
                        <h2 key={i} className="tag">
                          {pos.replace(new RegExp("_", "g"), " ")}
                        </h2>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Element>
          {moreCities.length > 0 && (
            <section className="section xl:max-w-4xl">
              <h1 className="section-title">Other cities</h1>
              <div className="grid grid-cols-3 gap-x-24 justify-center justify-items-center">
                {moreCities.map((city) => (
                  <Link
                    key={city.cityName}
                    href={`/cities/${city.cityName}`}
                    passHref
                  >
                    <div className="w-full cursor-pointer p-4 rounded-md flex flex-col gap-y-2 items-center border-2 hover:bg-gray-300/10">
                      <div className="relative aspect-square h-24">
                        <Image
                          src={city.cityMap.url}
                          alt={`${city.cityName} Map`}
                          layout="fill"
                          objectFit="contain"
                        ></Image>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <div>
                          <h1 className="text-2xl text-center font-serif uppercase text-gray-900">
                            {city.cityName}
                          </h1>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <HiLocationMarker className="text-gray-500" />
                            <p className="text-gray-500 text-base ml-1">
                              X: {city.cityCoordinates[0]} | Y:
                              {city.cityCoordinates[1]}
                            </p>
                          </div>
                          <div className="flex items-center">
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

  const cities = await getAllCities();

  return {
    props: {
      city: data.city,
      moreCities: data.moreCities,
      cities,
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
