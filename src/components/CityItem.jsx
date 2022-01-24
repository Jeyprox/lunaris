import Image from "next/image";

const CityItem = ({ name, mapUrl, isSelected }) => {
  return (
    <div
      className={`group hover:bg-gray-100/10 ${
        isSelected && "bg-gray-100/10"
      } py-6 px-2 duration-200 rounded-lg cursor-pointer grid items-center text-center`}
    >
      <div className="pb-4 px-8">
        <div
          className={`relative group-hover:scale-110 ${
            isSelected && "scale-110"
          } duration-200 select-none aspect-square w-20`}
        >
          <Image
            src={mapUrl}
            alt={`${name}-Map`}
            layout="fill"
            quality={75}
          ></Image>
        </div>
      </div>

      <h1 className="text-gray-200 text-xl uppercase font-serif">{name}</h1>
    </div>
  );
};

export default CityItem;
