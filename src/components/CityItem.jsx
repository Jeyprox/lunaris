import Image from "next/image";

const CityItem = ({ name, mapUrl, isSelected }) => {
  return (
    <div
      className={`group hover:bg-gray-100/10 ${
        isSelected && "bg-gray-100/10"
      } py-4 duration-200 rounded-md cursor-pointer flex flex-col items-center`}
    >
      <div className="pb-4 px-8 border-b">
        <div className="group-hover:scale-110 duration-200 select-none">
          <Image
            src={mapUrl}
            alt={`${name}-Map`}
            width="80"
            height="80"
          ></Image>
        </div>
      </div>

      <span className="w-4 h-4 -translate-y-2 bg-gray-200 rotate-45 duration-200"></span>
      <p className="text-gray-300 text-lg font-serif">{name}</p>
    </div>
  );
};

export default CityItem;
