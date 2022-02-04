import Image from "next/image";
import Link from "next/link";
import { HiLocationMarker, HiMap } from "react-icons/hi";

export const CityLink = ({ city }) => {
  return (
    <Link href={`/cities/${city.cityName.toLowerCase().replace(/\ /g, "-")}`}>
      <a className="grid w-full cursor-pointer justify-center gap-y-2 rounded-md border-2 border-gray-300 p-4 hover:bg-gray-300/10">
        <div className="relative mx-auto aspect-square h-24">
          <Image
            src={city.cityMap.url}
            alt={`${city.cityName} Map`}
            layout="fill"
            objectFit="contain"
            className="brightness-50"
          ></Image>
        </div>
        <div className="grid">
          <h1 className="mb-1 text-center font-serif text-2xl uppercase text-gray-900">
            {city.cityName}
          </h1>
          <div className="flex items-center">
            <HiLocationMarker className="text-gray-500" />
            <p className="ml-1 text-base text-gray-600">
              X: {city.cityCoordinates[0]} | Y:
              {city.cityCoordinates[1]}
            </p>
          </div>
          <div className="flex items-center">
            <HiMap className="text-gray-500" />
            <p className="ml-1 text-gray-600">{city.server}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};
