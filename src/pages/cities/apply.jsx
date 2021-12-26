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
  const [joinStatus, setJoinStatus] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState({});
  const {
    register,
    handleSubmit,
    control,
    getValues,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });
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
    if (!professions.length) {
      setError("professions", {
        type: "required",
        message: "Enter at least one profession",
      });
      return;
    }
    if (joinStatus !== 3) {
      setError("discordtag", {
        type: "missing-verification",
        message: "Please finish the discord name verification",
      });
      return;
    }
    const cityName = selectedCity.replace(/(\b[a-z](?!\s))/g, (letter) =>
      letter.toUpperCase()
    );
    const joinDate = [
      getValues("time_days"),
      getValues("time_weeks"),
      getValues("time_months"),
    ];
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        cityName,
        info: getValues(),
        joinDate,
        nations,
        professions,
      }),
    });
    const data = await res.json();
    if (data.id) {
      const message = { status: 200, message: "Application was sent" };
      setApplicationStatus(message);
      return;
    }
    const error = { status: 400, message: data.error };
    setApplicationStatus(error);
  };

  const verifyUser = async (e) => {
    e.preventDefault();
    if (errors.discordtag && errors.discordtag.type != "finish-verification")
      return;
    const discordName = getValues("discordtag");
    if (discordName.length < 6) return;
    if (joinStatus == 0 || joinStatus == 1) {
      const res = await fetch("/api/discord/verify-user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          discordName,
        }),
      });
      const { hasJoined } = await res.json();
      setJoinStatus(hasJoined);
      switch (hasJoined) {
        case 1:
          setError("discordtag", {
            type: "notjoined",
            message: "Please join the discord first",
          });
          break;
        case 2:
          setError("discordtag", {
            type: "finish-verification",
            message: "Please finish your verification in discord",
          });
          break;
      }
    } else if (joinStatus == 2) {
      const res = await fetch("/api/discord/finish-verification", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          discordName,
        }),
      });
      const { finished } = await res.json();
      if (finished) {
        setJoinStatus(3);
        clearErrors("discordtag");
        return;
      }
      setError("discordtag", {
        type: "verification-error",
        message: "There was an issue while trying to verify your discord name",
      });
    }
  };

  return (
    <>
      <section className="mt-24 container xl:max-w-4xl mx-auto">
        <h1 className="text-3xl w-full text-center mb-6 uppercase font-bold text-gray-900">
          Select a city
        </h1>
        <div className="relative flex justify-around items-center">
          {cities.map((city) => (
            <label
              onClick={() => setSelectedCity(city.cityName.toLowerCase())}
              className={`cursor-pointer border-2 border-gray-400 rounded px-2 py-1 hover:bg-gray-200/50 flex gap-x-2 items-center ${
                city.cityName.toLowerCase() == selectedCity &&
                "!bg-blue-300 border-blue-300"
              }`}
              key={city.cityName}
            >
              <input
                className="hidden"
                type="radio"
                {...register("city", { required: "Required field" })}
              />
              <span className="text-xl font-serif uppercase text-gray-800">
                {city.cityName}
              </span>
            </label>
          ))}
          <p className="form-error-message mt-2">{errors.city?.message}</p>
        </div>
      </section>
      <section className="container xl:max-w-xl mx-auto my-24">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-12">
          <div className="flex items-end justify-between gap-x-8">
            <label htmlFor="username" className="relative">
              <span className="block text-xl text-gray-800 font-semibold uppercase mb-1">
                Minecraft Name
                <strong className="ml-1 text-gray-400">*</strong>
              </span>
              <input
                className="form-input-field form-text-input"
                type="text"
                aria-invalid={errors.username ? true : false}
                placeholder="Example"
                {...register("username", {
                  required: "Required field",
                  maxLength: {
                    value: 16,
                    message:
                      "Minecraft name can't be longer than 16 characters",
                  },
                  minLength: 3,
                  pattern: {
                    value: /^\S+$/,
                    message: "Minecraft names can't have spaces",
                  },
                })}
              />
              <p role="alert" className="form-error-message">
                {errors.username?.message}
              </p>
            </label>
            <div className="relative w-16 h-16">
              {!errors.username && username.length > 3 ? (
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
          </div>
          <div className="flex gap-x-2 items-end">
            <label className="w-full grid gap-y-1">
              <span className="text-xl text-gray-800 font-semibold uppercase">
                Discord Tag
                <strong className="ml-1 text-gray-400">*</strong>
              </span>
              <div className="relative flex gap-x-2">
                <input
                  className="form-input-field form-text-input w-full"
                  type="text"
                  aria-invalid={errors.discordtag ? true : false}
                  placeholder="Example#9999"
                  {...register("discordtag", {
                    required: "Required field",
                    maxLength: {
                      value: 32,
                      message:
                        "Discord name can't be longer than 32 characters",
                    },
                    minLength: 2,
                    pattern: {
                      value: /\d{4}$/,
                      message: "Don't forget the identifier (eg. #9999)",
                    },
                  })}
                />
                <p role="alert" className="form-error-message">
                  {errors.discordtag?.message}
                </p>
              </div>
            </label>
            <button
              onClick={(e) => verifyUser(e)}
              className={`px-2 py-1.5 font-semibold uppercase font-serif border-2 hover:bg-gray-200/50 border-gray-500 rounded ${
                joinStatus == 3 && "border-green-400"
              } ${joinStatus == 2 && "border-orange-400"} ${
                joinStatus == 1 && "border-red-400"
              }`}
            >
              Verify
            </button>
          </div>
          <label className="w-full grid gap-y-1">
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Time On Stoneworks
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <div className="flex justify-between gap-x-4">
              <div className="relative flex items-center gap-x-2">
                <input
                  className="number-input form-input-field w-12 text-center text-base font-bold"
                  type="number"
                  aria-invalid={errors.time_days ? true : false}
                  placeholder="4"
                  {...register("time_days", {
                    required: "Required field",
                    min: 0,
                    max: { value: 6, message: "Max. 6 days" },
                    valueAsNumber: true,
                  })}
                />
                <p role="alert" className="form-error-message">
                  {errors.time_days?.message}
                </p>
                <p className="text-lg font-serif text-gray-700 uppercase">
                  Day(s)
                </p>
              </div>
              <div className="relative flex items-center gap-x-2">
                <input
                  className="number-input form-input-field w-12 text-center text-base font-bold"
                  type="number"
                  aria-invalid={errors.time_weeks ? true : false}
                  placeholder="1"
                  {...register("time_weeks", {
                    required: "Required field",
                    min: 0,
                    max: { value: 4, message: "Max. 4 weeks" },
                    valueAsNumber: true,
                  })}
                />
                <p className="form-error-message">
                  {errors.time_weeks?.message}
                </p>
                <p className="text-lg font-serif text-gray-700 uppercase">
                  Week(s)
                </p>
              </div>
              <div className="relative flex items-center gap-x-2">
                <input
                  className="number-input form-input-field w-12 text-center text-base font-bold"
                  type="number"
                  aria-invalid={errors.time_months ? true : false}
                  placeholder="3"
                  {...register("time_months", {
                    required: "Required field",
                    min: 0,
                    max: { value: 64, message: "Max. 64 months" },
                    valueAsNumber: true,
                  })}
                />
                <p className="form-error-message">
                  {errors.time_months?.message}
                </p>
                <p className="text-lg font-serif text-gray-700 uppercase">
                  Month(s)
                </p>
              </div>
            </div>
          </label>
          <label className="grid gap-y-1">
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Your timezone
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <div className="relative flex items-center gap-x-2">
              <p className="text-lg font-serif text-gray-700 uppercase">GMT</p>
              <input
                className="number-input form-input-field w-12 text-center font-bold"
                type="number"
                aria-invalid={errors.timezone ? true : false}
                placeholder="+1"
                {...register("timezone", {
                  required: "Required field",
                  min: {
                    value: -12,
                    message: "Min. timezone difference from gmt is 12",
                  },
                  max: {
                    value: 12,
                    message: "Max. timezone difference from gmt is 12",
                  },
                  valueAsNumber: true,
                })}
              />
              <p role="alert" className="form-error-message">
                {errors.timezone?.message}
              </p>
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
                  placeholder="Plagatea, Simulami..."
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
          <div className="relative">
            <label>
              <span className="text-xl text-gray-800 font-semibold uppercase mb-1">
                Ideas for Profession
                <strong className="ml-1 text-gray-400">*</strong>
              </span>
              <div className="flex">
                <input
                  className="w-full border-2 border-gray-500 rounded placeholder:font-serif py-1.5 px-2"
                  type="text"
                  aria-invalid={errors.professions ? true : false}
                  placeholder="Builder, Politician..."
                  {...register("professions", { required: false })}
                />
                <p role="alert" className="form-error-message">
                  {errors.professions?.message}
                </p>
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
          <label className="grid gap-y-1">
            <span className="text-xl text-gray-800 font-semibold uppercase">
              Why do you want to join Lunaris
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <div className="relative">
              <textarea
                className="border-2 border-gray-500 rounded placeholder:font-serif w-full max-h-48"
                type="text"
                aria-invalid={errors.joinreason ? true : false}
                maxLength="200"
                placeholder="Explain why you want to join Lunaris"
                {...register("joinreason", {
                  required: "Required field",
                  maxLength: 200,
                })}
              />
              <p role="alert" className="form-error-message">
                {errors.joinreason?.message}
              </p>
              <span className="absolute bottom-2 right-4 text-gray-500 font-semibold text-sm">
                {joinreason.length}/200
              </span>
            </div>
            <p className="uppercase text-gray-600 font-semibold mt-6">
              <strong className="mr-1">*</strong>
              Required Field
            </p>
          </label>
          <div className="w-2/5 mx-auto">
            <input
              type="submit"
              className={`cursor-pointer w-full btn text-gray-800 font-bold border-gray-500 ${
                applicationStatus.status == 200 && "!border-green-400"
              } ${applicationStatus.status == 400 && "!border-red-400"}`}
            />
            {applicationStatus.status != -1 && (
              <p className="text-base text-center uppercase font-semibold text-gray-500 mt-2">
                {applicationStatus.message}
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
