import {
  assertEquals,
} from "../test_deps.ts";

import { filterHabitablePlanets } from "./planets.ts";

const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_smass: "1",
  koi_srad: "1",
};

const NOT_CONFIRMED = {
  koi_disposition: "FALSE POSITIVE",
  koi_prad: "1",
  koi_smass: "1",
  koi_srad: "1",
};

const TOO_SMALL_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "0.5",
  koi_smass: "1",
  koi_srad: "1",
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
  koi_smass: "1",
  koi_srad: "1",
};

const TOO_SMALL_STELLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_smass: "0.78",
  koi_srad: "1",
};

const TOO_LARGE_STELLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_smass: "1.04",
  koi_srad: "1",
};

const TOO_SMALL_STELLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_smass: "1",
  koi_srad: "0.99",
};

const TOO_LARGE_STELLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_smass: "1",
  koi_srad: "1.01",
};

Deno.test("filter only habitable planets", () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED,
    TOO_SMALL_PLANETARY_RADIUS,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_SMALL_STELLAR_MASS,
    TOO_LARGE_STELLAR_MASS,
    TOO_SMALL_STELLAR_RADIUS,
    TOO_LARGE_STELLAR_RADIUS,
  ]);
  assertEquals(
    filtered,
    [HABITABLE_PLANET],
  );
});
