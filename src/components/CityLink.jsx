import Image from "next/image";
import Link from "next/link";
import { HiLocationMarker, HiMap } from "react-icons/hi";

export const CityLink = ({ city }) => {
  return (
    <Link href={`/cities/${city.cityName}`} passHref>
      <div className="cursor-pointer w-full p-4 rounded-md grid gap-y-2 justify-center border-2 border-gray-300 hover:bg-gray-300/10">
        <div className="mx-auto relative aspect-square h-24">
          <Image
            src={city.cityMap.url}
            alt={`${city.cityName} Map`}
            layout="fill"
            objectFit="contain"
            className="brightness-50"
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
  );
};
