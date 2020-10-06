import { log, _ } from "../deps.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: string[];
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<number, Launch>();

async function fetchData(url: string) {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        log.warning("Problem downloading launch data.");
        throw new Error("Launch data download failed.");
      }
      return res.json();
    })
    .catch((err) => {
      throw new Error(err.message);
    });
}

const url = "https://api.spacexdata.com/v4";
const launchData = await fetchData(`${url}/launches`);
const payloadsData = await fetchData(`${url}/payloads`);
const rocketsData = await fetchData(`${url}/rockets`);

for (const launch of launchData) {
  const payloads = launch.payloads;

  const customers = _.flatMap(payloads, (payloadId: string) => {
    return payloadsData.filter((element: any) =>
      element.id == payloadId
    )[0]["customers"];
  });

  const rocket = rocketsData.filter((element: any) =>
    element.id == launch.rocket
  )[0]["name"];

  const flightData = {
    flightNumber: launch.flight_number,
    mission: launch.name,
    rocket: rocket,
    launchDate: launch.date_unix,
    upcoming: launch.upcoming,
    success: launch.success,
    customers: customers,
  };
  launches.set(flightData.flightNumber, flightData);

  log.info(JSON.stringify(flightData));
}

log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export function getAll() {
  return Array.from(launches.values());
}

export function getOne(id: number) {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
}

export function addOne(data: Launch) {
  const newLaunch = {
    ...data,
    customers: ["SD Flights"],
    upcoming: true,
  };
  launches.set(data.flightNumber, newLaunch);
}

export function removeOne(id: number) {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
}
