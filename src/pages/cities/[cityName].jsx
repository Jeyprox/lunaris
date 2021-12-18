import Image from "next/image";
import ErrorPage from "next/error";
import {
  HiArrowSmLeft,
  HiArrowSmRight,
  HiArrowSmUp,
  HiChevronDown,
  HiLocationMarker,
  HiMap,
  HiUsers,
} from "react-icons/hi";
import MainNav from "../../components/MainNav";
import { getAllCities, getCityByName } from "../../lib/graphcms";

const City = ({ city, moreCities }) => {
  if (!city?.cityName) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      {city.cityName && (
        <div>
          <header>
            <MainNav cityName={city.cityName.toLowerCase()} />
          </header>
          <section className="relative w-screen h-[80vh]">
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
            <div className="cursor-pointer absolute left-1/2 -translate-x-1/2 -bottom-16 p-2">
              <div
                className={`p-1.5 border-2 border-gray-700 hover:bg-gray-900/10 duration-200 rounded-full`}
              >
                <HiChevronDown className="text-2xl text-gray-700" />
              </div>
            </div>
          </section>
          <section className="section mt-32 xl:max-w-6xl flex">
            <div className="relative w-80 h-80">
              <Image
                src={city.cityMap.url}
                alt={`${city.cityName} Map`}
                layout="fill"
                objectFit="contain"
              ></Image>
            </div>
            <div className="ml-16 w-full flex flex-col justify-around">
              <div>
                <h1 className="text-4xl uppercase font-bold mb-4">
                  {city.cityName}
                </h1>
                <p className="text-gray-600">{city.cityDescription}</p>
              </div>
              <div className="grid grid-cols-3 w-2/3 divide-x">
                <div className="flex flex-col items-center justify-center">
                  <HiUsers className="text-6xl text-gray-300" />
                  <p className="text-2xl font-semibold text-gray-500">
                    {city.citizenCount}
                  </p>
                </div>
                <div className="flex items-center justify-center col-span-2">
                  <div className="flex items-center mr-4">
                    <HiArrowSmRight className="text-6xl text-gray-300 mr-2" />
                    <p className="text-2xl font-semibold text-gray-500">
                      X: {city.cityCoordinates[0]}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <HiArrowSmUp className="text-6xl text-gray-300 mr-2" />
                    <p className="text-2xl font-semibold text-gray-500">
                      Y: {city.cityCoordinates[1]}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex divide-x">
                <p className="text-xl text-gray-500 mr-4">
                  Server:
                  <span className="text-gray-700 text-base uppercase ml-2 font-serif py-1 px-1.5 border rounded">
                    {city.server}
                  </span>
                </p>
                <div className="flex items-center text-xl text-gray-500 pl-4">
                  <p className="mr-4">Tags:</p>
                  {city.cityStatus.map((status) => (
                    <span
                      className="text-gray-700 text-base mx-1.5 py-1 px-1.5 font-serif uppercase border rounded"
                      key={status}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {moreCities.length > 0 && (
            <section className="section flex justify-between items-center">
              {moreCities.map((city) => (
                <div
                  className="cursor-pointer p-4 rounded-md flex items-center border-2 hover:bg-gray-300/10"
                  key={city.cityName}
                >
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
              ))}
            </section>
          )}
        </div>
      )}
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const cityName =
    params.cityName.charAt(0).toUpperCase() + params.cityName.slice(1);
  const data = await getCityByName(cityName);
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
