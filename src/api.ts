import { Router } from "./deps.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.throw(501, "Sorry, not available");
  ctx.response.body = "Space Control API";
});

router.get("/planets", (ctx) => {
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
  ctx.response.body = launches.getAll();
});

router.get("/launches/:id", (ctx) => {
  if (ctx.params?.id) {
    const launchesList = launches.getOne(Number(ctx.params.id));
    if (launchesList) {
      ctx.response.body = launchesList;
    } else {
      ctx.throw(400, `Launch with ID ${ctx.params.id} doesn't exist`);
    }
  }
});

router.post("/launches", async (ctx) => {
  const bodyValue = await ctx.request.body().value;
  launches.addOne(bodyValue);

  ctx.response.body = {
    success: true,
  };
  ctx.response.status = 201;
});

router.delete("/launches/:id", (ctx) => {
  if (ctx.params?.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = {
      success: result,
    };
  }
});

export default router;