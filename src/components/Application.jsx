import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { HiChevronDown, HiPlus, HiX } from "react-icons/hi";

const Application = ({ cities, currentCity, closeApplication }) => {
  const [nations, setNations] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [joinStatus, setJoinStatus] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState({});
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { city: currentCity },
  });
  register("city", { required: "Required field" });
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
  const selectedCity = useWatch({
    control,
    name: "city",
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
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        info: getValues(),
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
    const discordName = getValues("discordtag");
    if (discordName.length < 6) return;
    if (errors.discordtag?.type === "pattern") return;
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
          clearErrors("discordtag");
          setError("discordtag", {
            type: "notjoined",
            message: "Please join the discord first",
          });
          break;
        case 2:
          clearErrors("discordtag");
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
        message: "Your verification failed, please restart the process",
      });
      setJoinStatus(0);
    }
  };

  return (
    <>
      <section className="container relative mx-auto my-16 grid gap-8 xl:max-w-xl">
        <span
          onClick={closeApplication}
          className="absolute right-0 cursor-pointer rounded-full border-2 border-gray-600 duration-100 hover:bg-gray-300/50"
        >
          <HiX className="m-1 text-2xl text-gray-600" />
        </span>
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold uppercase text-gray-800">
            Lunari Empire
          </h1>
          <h2 className="font-serif text-lg text-gray-600">
            Application for Citizenship
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-12">
          <div className="grid gap-y-1">
            <span className="text-xl font-semibold uppercase text-gray-800">
              Select a city
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <Listbox
              as="div"
              className="relative w-full"
              value={selectedCity}
              onChange={(newValue) => setValue("city", newValue)}
            >
              <Listbox.Button className="flex w-full items-center justify-between rounded border-2 border-gray-500 px-2 py-1.5">
                <p className="font-serif text-gray-800">{selectedCity}</p>
                <HiChevronDown className="text-xl text-gray-800" />
              </Listbox.Button>
              <Transition
                enter="duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded bg-gray-100 shadow-md">
                  {cities.map((city) => (
                    <Listbox.Option
                      className={`cursor-pointer`}
                      value={city.cityName}
                      key={city.cityName}
                    >
                      {({ selected }) => (
                        <p
                          className={`px-3 py-1.5 ${
                            selected && "!bg-blue-300"
                          } font-serif text-gray-800 duration-100 hover:bg-gray-200/50`}
                        >
                          {city.cityName}
                        </p>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
            <p role="alert" className="form-error-message">
              {errors.city?.message}
            </p>
          </div>
          <div className="flex items-end justify-between gap-x-2">
            <label htmlFor="username" className="relative grid flex-1 gap-y-1">
              <span className="block text-xl font-semibold uppercase text-gray-800">
                Minecraft Name
                <strong className="ml-1 text-gray-400">*</strong>
              </span>
              <input
                className="form-input-field form-text-input w-full"
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
            <div className="relative aspect-square h-full">
              {!errors.username && username.length > 3 ? (
                <Image
                  src={`https://minotar.net/avatar/${username}/64`}
                  alt={username}
                  layout="fill"
                  objectFit="contain"
                  blurDataURL="https://minotar.net/avatar/steve/64"
                  placeholder="blur"
                  className="rounded"
                ></Image>
              ) : (
                <div className="grid h-full w-full place-content-center rounded border-2 border-blue-400 bg-blue-300/50">
                  <span className="text-4xl font-bold text-gray-800">?</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-end gap-x-2">
            <label className="grid w-full gap-y-1">
              <span className="text-xl font-semibold uppercase text-gray-800">
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
              className={`rounded border-2 border-blue-400 px-2 py-1.5 font-serif font-semibold uppercase text-gray-800 duration-100 hover:bg-blue-300/50 ${
                joinStatus == 3 && "border-green-400"
              } ${joinStatus == 2 && "border-orange-400"} ${
                joinStatus == 1 && "border-red-400"
              }`}
            >
              Verify
            </button>
          </div>
          <label className="grid w-full gap-y-1">
            <span className="text-xl font-semibold uppercase text-gray-800">
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
                <p className="font-serif text-lg uppercase text-gray-700">
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
                <p className="font-serif text-lg uppercase text-gray-700">
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
                <p className="font-serif text-lg uppercase text-gray-700">
                  Month(s)
                </p>
              </div>
            </div>
          </label>
          <label className="grid gap-y-1">
            <span className="text-xl font-semibold uppercase text-gray-800">
              Your timezone
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <div className="relative flex items-center gap-x-2">
              <p className="font-serif text-lg uppercase text-gray-700">GMT</p>
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
              <span className="mb-1 text-xl font-semibold uppercase text-gray-800">
                Previous Nations
              </span>
              <div className="flex gap-x-2">
                <input
                  className="form-input-field form-text-input w-full"
                  type="text"
                  placeholder="Plagatea, Simulami..."
                  {...register("nations", { required: false })}
                />
                <button
                  onClick={(e) => (
                    e.preventDefault(), addNation(getValues("nations"))
                  )}
                  className="rounded border-2 border-gray-500 px-2 py-1.5 duration-200 hover:bg-gray-200/50"
                  aria-label="Add Nation"
                >
                  <HiPlus className="text-xl" />
                </button>
              </div>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {nations.map((nation) => (
                <div
                  onClick={() =>
                    setNations(
                      nations.filter(
                        (currentNation) => currentNation !== nation
                      )
                    )
                  }
                  className="flex cursor-pointer items-center rounded border-2 border-gray-400 px-1.5 py-0.5 duration-200 hover:bg-gray-200/50"
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
              <span className="mb-1 text-xl font-semibold uppercase text-gray-800">
                Ideas for Profession
                <strong className="ml-1 text-gray-400">*</strong>
              </span>
              <div className="flex gap-x-2">
                <input
                  className="form-input-field form-text-input w-full"
                  type="text"
                  aria-invalid={errors.professions ? true : false}
                  placeholder="Builder, Politician..."
                  {...register("professions", { required: false })}
                />
                <p role="alert" className="form-error-message">
                  {errors.professions?.message}
                </p>
                <button
                  onClick={(e) => (
                    e.preventDefault(), addProfession(getValues("professions"))
                  )}
                  className="rounded border-2 border-gray-500 px-2 py-1.5 duration-200 hover:bg-gray-200/50"
                  aria-label="Add Profession"
                >
                  <HiPlus className="text-xl" />
                </button>
              </div>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {professions.map((profession) => (
                <div
                  onClick={() =>
                    setProfessions(
                      professions.filter(
                        (currentProfession) => currentProfession !== profession
                      )
                    )
                  }
                  className="flex cursor-pointer items-center rounded border-2 border-gray-400 px-1.5 py-0.5 duration-200 hover:bg-gray-200/50"
                  key={profession}
                >
                  <p className="uppercase text-gray-700">{profession}</p>
                  <HiX className="ml-2 text-lg text-gray-500" />
                </div>
              ))}
            </div>
          </div>
          <label className="grid gap-y-1">
            <span className="text-xl font-semibold uppercase text-gray-800">
              Why do you want to join Lunaris
              <strong className="ml-1 text-gray-400">*</strong>
            </span>
            <div className="relative">
              <textarea
                className="form-input-field form-text-input max-h-48 min-h-[5em] w-full font-normal"
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
              <span className="absolute bottom-2 right-4 text-sm font-semibold text-gray-500">
                {joinreason.length}/200
              </span>
            </div>
          </label>
          <label className="relative cursor-pointer">
            <div>
              <input
                className="cursor-pointer rounded bg-inherit focus:ring-transparent focus:ring-offset-transparent"
                type="checkbox"
                aria-invalid={errors.commitment ? true : false}
                {...register("commitment", {
                  required: "Required field",
                })}
              />
              <span className="ml-2 font-semibold text-gray-500">
                Are you going to be commited to playing on the server?
              </span>
            </div>
            <p role="alert" className="form-error-message">
              {errors.commitment?.message}
            </p>
          </label>
          <div>
            <p className="font-semibold uppercase text-gray-600">
              <strong className="mr-1">*</strong>
              Required Field
            </p>
          </div>
          <div className="mx-auto grid w-4/5">
            <div className="flex w-full gap-4">
              <button
                onClick={closeApplication}
                className="btn rounded border-red-400 text-gray-800 hover:bg-red-300/50"
              >
                Close
              </button>
              <input
                type="submit"
                className={`btn w-full cursor-pointer rounded border-blue-400 font-bold text-gray-800 hover:bg-blue-300/50 ${
                  applicationStatus.status == 200 &&
                  "!border-green-400 hover:bg-green-300/50"
                } ${
                  applicationStatus.status == 400 &&
                  "!border-red-400 hover:bg-red-300/50"
                }`}
              />
            </div>

            {applicationStatus.status != -1 && (
              <p className="mt-2 text-center text-base font-semibold uppercase text-gray-500">
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
