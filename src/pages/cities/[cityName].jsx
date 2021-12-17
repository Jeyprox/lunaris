import Image from "next/image";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { HiChevronDown } from "react-icons/hi";
import MainNav from "../../components/MainNav";
import {
  getAllCities,
  getAllCityPreviews,
  getCityByName,
} from "../../lib/graphcms";

const City = ({ city, moreCities }) => {
  if (!city?.cityName) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      {city.cityName && (
        <div>
          <header>
            <MainNav cityName={city.cityName} />
          </header>
          <section className="relative w-screen h-[80vh]">
            <div className="-z-10 overflow-hidden absolute w-full h-full">
              <Image
                src={city.landingImage.url}
                alt="City Landing"
                layout="fill"
                className="object-cover blur-xs scale-105"
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
              <div className="p-1.5 border-2 border-gray-900 hover:bg-gray-900/10 duration-200 rounded-full">
                <HiChevronDown className="text-2xl text-gray-900" />
              </div>
            </div>
          </section>
          {moreCities.length > 0 && (
            <section>
              {moreCities.map((city) => (
                <div key={city.cityName}>{city.cityName}</div>
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
  console.log(data);
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
