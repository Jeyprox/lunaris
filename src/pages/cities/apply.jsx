import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { HiCheck, HiPlus, HiRefresh, HiX } from "react-icons/hi";
import { getAllCityPreviews } from "../../lib/graphcms";

const Application = ({ cities }) => {
  const router = useRouter();
  const { cityOrigin } = router.query;
  const [selectedCity, setSelectedCity] = useState(cityOrigin);
  const [nations, setNations] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [applicationSent, setApplicationSent] = useState(false);
  const { register, handleSubmit, control, getValues, resetField } = useForm();
  const username = useWatch({
    control,
    name: "username",
    defaultValue: "",
  });
  const joinreason = useWatch({
    control,
    name: "joinreason",
    defaultValue: "",
  });

  const addNation = (nation) => {
    if (nations.includes(nation) || nations.length > 3) return;
    resetField("nations");
    setNations([...nations, nation]);
  };

  const addProfession = (profession) => {
    if (professions.includes(profession) || professions.length > 3) return;
    resetField("professions");
    setProfessions([...professions, profession]);
  };

  const onSubmit = async () => {
    if (!selectedCity || !nations || !professions || applicationSent) return;
    const cityName = selectedCity.replace(/(\b[a-z](?!\s))/g, (letter) =>
      letter.toUpperCase()
    );
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        cityName,
        info: getValues(),
        nations,
        professions,
      }),
    });
    if (!res.error) setApplicationSent(true);
  };

  return (
    <>
      <section className="mt-24 container xl:max-w-4xl mx-auto">
        <h1 className="text-3xl w-full text-center mb-6 uppercase font-bold text-gray-900">
          Select a city
        </h1>
        <div className="flex justify-around items-center">
          {cities.map((city) => (
            <div
              onClick={() => setSelectedCity(city.cityName.toLowerCase())}
              className={` cursor-pointer border-2 border-gray-400 rounded hover:bg-gray-200/50 ${
                city.cityName.toLowerCase() == selectedCity &&
                "!bg-blue-300 border-blue-300"
              }`}
              key={city.cityName}
            >
              <h1 className="px-2 py-1 text-xl font-serif uppercase text-gray-800">
                {city.cityName}
              </h1>
            </div>
          ))}
        </div>
      </section>
      <section className="container xl:max-w-4xl mx-auto mb-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12"
        >
          <div className="flex items-center">
            <div className="relative w-16 h-16 mr-6">
              {username.length >= 3 ? (
                <Image
                  src={`https://minotar.net/avatar/${username}/64`}
                  alt={username}
                  layout="fill"
                  objectFit="contain"
                  blurDataURL="https://minotar.net/avatar/steve/64"
                  placeholder="blur"
                ></Image>
              ) : (
                <div className="w-full h-full bg-gray-700 rounded grid place-content-center">
                  <span className="text-gray-100 font-bold text-4xl">?</span>
                </div>
              )}
            </div>
            <label className="flex flex-col">
              <span className="text-xl text-gray-800 font-semibold uppercase mb-1">
                Minecraft Name
              </span>
              <input
                className="focus:ring-blue-300 text-gray-700 border-2 rounded placeholder:font-serif placeholder:font-normal font-semibold uppercase px-2 py-1.5"
                type="text"
                placeholder="Example"
                {...register("username", {
                  required: true,
                  maxLength: 16,
                  minLength: 3,
                  pattern: /^\S*$/,
                })}
              />
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex flex-col">
              <span className="text-xl text-gray-800 font-semibold uppercase mb-1">
                Discord Tag
              </span>
              <div className="flex">
                <input
                  className="focus:ring-blue-300 text-gray-700 border-2 rounded placeholder:font-serif placeholder:font-normal font-semibold uppercase px-2 py-1.5"
                  type="text"
                  placeholder="Example#9999"
                  {...register("discordtag", {
                    required: true,
                    maxLength: 32,
                    minLength: 2,
                    pattern: /\d{4}$/,
                  })}
                />
                <button className="ml-2 p-1.5 border-2 hover:bg-gray-200/50 border-gray-500 rounded">
                  <HiCheck className="text-2xl" />
                </button>
                <button className="ml-2 p-1.5 border-2 hover:bg-gray-200/50 border-gray-500 rounded">
                  <HiRefresh className="text-2xl" />
                </button>
              </div>
            </label>
          </div>
          <label>
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Time On Stoneworks
            </span>
            <div className="flex items-center mt-2">
              <input
                className="number-input focus:ring-blue-300 border-2 text-gray-700 rounded px-1.5 py-1 w-12 text-center text-base font-bold"
                type="number"
                step={0.1}
                placeholder="1.5"
                {...register("joindate", {
                  required: true,
                  max: 12,
                  valueAsNumber: true,
                })}
              />
              <p className="ml-2 text-lg font-serif text-gray-700 uppercase">
                Months
              </p>
            </div>
          </label>
          <label>
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Your timezone
            </span>
            <div className="flex items-center mt-2">
              <p className="mr-2 text-lg font-serif text-gray-700 uppercase">
                GMT
              </p>
              <input
                className="number-input focus:ring-blue-300 border-2 text-gray-700 rounded px-1.5 py-1 w-12 text-center text-base font-bold"
                type="number"
                step={1}
                placeholder="+1"
                {...register("timezone", {
                  required: true,
                  min: -12,
                  max: 12,
                  valueAsNumber: true,
                })}
              />
            </div>
          </label>
          <div>
            <label>
              <span className="text-xl text-gray-800 font-semibold uppercase mb-1">
                Previous Nations
              </span>
              <div className="flex">
                <input
                  className="w-full border-2 border-gray-500 rounded placeholder:font-serif py-1.5 px-2"
                  type="text"
                  placeholder="Tortuga, Uldarash..."
                  {...register("nations", { required: false })}
                />
                <button
                  onClick={() => addNation(getValues("nations"))}
                  className="ml-2 border-2 border-gray-500 hover:bg-gray-200/50 duration-200 rounded px-2 py-1.5"
                >
                  <HiPlus className="text-xl" />
                </button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {nations.map((nation) => (
                <div
                  onClick={() =>
                    setNations(
                      nations.filter(
                        (currentNation) => currentNation !== nation
                      )
                    )
                  }
                  className="flex items-center cursor-pointer hover:bg-gray-200/50 duration-200 px-1.5 py-0.5 rounded border-gray-400 border-2"
                  key={nation}
                >
                  <p className="uppercase text-gray-700">{nation}</p>
                  <HiX className="ml-2 text-lg text-gray-500" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>
              <span className="text-xl text-gray-800 font-semibold uppercase mb-1">
                Ideas for Profession
              </span>
              <div className="flex">
                <input
                  className="w-full border-2 border-gray-500 rounded placeholder:font-serif py-1.5 px-2"
                  type="text"
                  placeholder="Builder, Politician..."
                  {...register("professions", { required: false })}
                />
                <button
                  onClick={() => addProfession(getValues("professions"))}
                  className="ml-2 border-2 border-gray-500 hover:bg-gray-200/50 duration-200 rounded px-2 py-1.5"
                >
                  <HiPlus className="text-xl" />
                </button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {professions.map((profession) => (
                <div
                  onClick={() =>
                    setProfessions(
                      professions.filter(
                        (currentProfession) => currentProfession !== profession
                      )
                    )
                  }
                  className="flex items-center cursor-pointer hover:bg-gray-200/50 duration-200 px-1.5 py-0.5 rounded border-gray-400 border-2"
                  key={profession}
                >
                  <p className="uppercase text-gray-700">{profession}</p>
                  <HiX className="ml-2 text-lg text-gray-500" />
                </div>
              ))}
            </div>
          </div>
          <label className="col-span-2">
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Why do you want to join Lunaris
            </span>
            <div className="relative mt-1">
              <textarea
                className="border-2 border-gray-500 rounded placeholder:font-serif w-full max-h-48"
                type="text"
                maxLength="200"
                placeholder="Explain why you want to join Lunaris"
                {...register("joinreason", { required: true, maxLength: 200 })}
              />
              <span className="absolute bottom-2 right-4 text-gray-500 font-semibold text-sm">
                {joinreason.length}/200
              </span>
            </div>
          </label>
          <div className="col-span-2 w-1/4 mx-auto">
            <input
              type="submit"
              className={`cursor-pointer w-full btn text-gray-800 font-bold border-gray-500 ${
                applicationSent && "!border-green-400"
              }`}
            />
            {applicationSent && (
              <p className="text-base text-center uppercase font-semibold text-gray-500 mt-2">
                Application was sent
              </p>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Application;

export const getStaticProps = async () => {
  const data = await getAllCityPreviews();
  return {
    props: {
      cities: data,
    },
  };
};
