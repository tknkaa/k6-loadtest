import { randomIndex, requestOnce, SHARDS } from "./lib/request.js";

const STAGE_DURATION = __ENV.STAGE_DURATION ?? "5m";
const RATES = (__ENV.RATES ?? "100,250,500").split(",").map(Number);

export const options = {
  discardResponseBodies: false,
  scenarios: {
    ramp: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      preAllocatedVUs: 200,
      maxVUs: Math.ceil(40000 / SHARDS),
      stages: RATES.flatMap((rate) => [
        { target: Math.ceil(rate / SHARDS), duration: "30s" },
        { target: Math.ceil(rate / SHARDS), duration: STAGE_DURATION },
      ]),
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default () => requestOnce(randomIndex());
