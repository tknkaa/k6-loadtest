import { randomIndex, requestOnce, SHARDS } from "./lib/request.js";

const STAGE_DURATION = __ENV.STAGE_DURATION ?? "5m";
const RATES = (__ENV.RATES ?? "100,250,500").split(",").map(Number);
const RAMP_DURATION = __ENV.RAMP_DURATION ?? "30s";

export const options = {
  discardResponseBodies: false,
  scenarios: {
    ramp: {
      executor: "ramping-arrival-rate",
      timeUnit: "1s",
      preAllocatedVUs: 200,
      maxVUs: Math.ceil(Number(__ENV.MAX_VUS ?? "40000") / SHARDS),
      startRate: 0,
      stages: RATES.flatMap((rate) => [
        { target: Math.ceil(rate / SHARDS), duration: RAMP_DURATION },
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
