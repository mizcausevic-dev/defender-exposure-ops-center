import { controlGaps, exposureLane, summary } from "../src/services/defenderExposureOpsCenterService.js";

console.log("defender-exposure-ops-center demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(
  JSON.stringify(
    exposureLane().map((lane) => ({
      lane: lane.lane,
      owner: lane.owner,
      status: lane.status
    })),
    null,
    2
  )
);
console.log(JSON.stringify(controlGaps().slice(0, 3), null, 2));
