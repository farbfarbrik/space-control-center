import {
  log,
  join,
  BufReader,
  parse,
  _,
} from "../deps.ts";

interface Planet {
  [key: string]: string;
}

let planets: Planet[];

export function filterHabitablePlanets(planets: Planet[]) {
  return planets.filter((planet: Planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" && planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });
}

async function loadPlanetsData() {
  const path = join("data", "kepler_exoplanets_nasa.csv");
  const file = await Deno.open(path, { read: true, write: false });
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  Deno.close(file.rid);

  const planets: Planet[] = filterHabitablePlanets(result as Planet[]);

  return planets.map((planet) => {
    return _.pick(
      planet,
      [
        "koi_prad",
        "koi_smass",
        "koi_srad",
        "kepler_name",
        "koi_count",
        "koi_steff",
      ],
    );
  });
}

planets = await loadPlanetsData();
log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
  return planets;
}
