import Image from "next/image";
import { Fragment } from "react";
import { FaDiscord } from "react-icons/fa";
import { HiPencilAlt, HiTag } from "react-icons/hi";
import { RiGovernmentFill } from "react-icons/ri";

const GovernmentPosition = ({ uuid, player, colour }) => {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div
        className={`flex-none rounded px-4 py-2`}
        style={{ backgroundColor: colour }}
      >
        <div className="relative h-40 w-20">
          <Image
            src={`https://crafatar.com/renders/body/${uuid}?scale=5&overlay`}
            alt={`${player.ign} avatar`}
            layout="fill"
            objectFit="contain"
            quality={50}
          />
        </div>
      </div>
      <div className="grid w-fit grid-cols-3 items-start gap-y-2 gap-x-4">
        {Object.entries(player).map(
          ([key, value]) =>
            value && (
              <Fragment key={key}>
                <div className="flex items-center gap-2 py-1">
                  {key === "ign" ? (
                    <HiTag className="flex-none text-xl text-gray-500" />
                  ) : key === "discord" ? (
                    <FaDiscord className="flex-none text-xl text-gray-500" />
                  ) : key === "govPos" ? (
                    <HiPencilAlt className="flex-none text-xl text-gray-500" />
                  ) : (
                    <RiGovernmentFill className="flex-none text-xl text-gray-500" />
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
                    <h1 className="col-span-2 text-xl font-semibold uppercase text-gray-900 xl:text-2xl">
                      {value}
                    </h1>
                  ) : (
                    <h2 className="tag col-span-2 w-fit">{value}</h2>
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
