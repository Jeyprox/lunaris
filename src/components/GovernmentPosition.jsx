import Image from "next/image";
import { Fragment } from "react";
import { FaDiscord } from "react-icons/fa";
import { HiPencilAlt, HiTag } from "react-icons/hi";
import { RiGovernmentFill } from "react-icons/ri";

const GovernmentPosition = ({ uuid, player, colour }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div
        className={`flex-none px-4 py-2 rounded`}
        style={{ backgroundColor: colour }}
      >
        <div className="relative w-20 h-40">
          <Image
            src={`https://crafatar.com/renders/body/${uuid}?scale=5&overlay`}
            alt={`${player.ign} avatar`}
            layout="fill"
            objectFit="contain"
            quality={50}
          />
        </div>
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

                  <p className="text-lg uppercase">{key.toUpperCase()}</p>
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
                    <h2 className="tag w-fit col-span-2">{value}</h2>
                  )}
                </div>
              </Fragment>
            )
        )}
      </div>
    </div>
  );
};

export default GovernmentPosition;
