import Image from "next/image";

const CityItem = ({ name, mapUrl, isSelected }) => {
  return (
    <div
      className={`group hover:bg-gray-100/10 ${
        isSelected && "bg-gray-100/10"
      } grid cursor-pointer items-center rounded-lg py-6 px-2 text-center duration-200`}
    >
      <div className="px-8 pb-4">
        <div
          className={`relative mx-auto group-hover:scale-110 ${
            isSelected && "scale-110"
          } aspect-square w-16 select-none duration-200 lg:w-20`}
        >
          <Image
            src={mapUrl}
            alt={`${name}-Map`}
            layout="fill"
            quality={75}
          ></Image>
        </div>
      </div>
      <h1 className="font-serif text-lg uppercase text-gray-200 lg:text-xl">
        {name}
      </h1>
    </div>
  );
};

export default CityItem;
