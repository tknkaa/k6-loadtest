import { sleep } from "k6";
import { requestOnce, SHARD, SHARDS } from "./lib/request.js";

const TOTAL = Number(__ENV.BURST_TOTAL ?? "15000");
const START_AT_MS = Number(__ENV.START_AT) * 1000;
const vus = Math.ceil(TOTAL / SHARDS);

export const options = {
  discardResponseBodies: false,
  scenarios: {
    burst: {
      executor: "per-vu-iterations",
      vus,
      iterations: 1,
      maxDuration: "10m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
  },
};

export default () => {
  sleep(Math.max(0, (START_AT_MS - Date.now()) / 1000));
  requestOnce(SHARD * vus + __VU - 1);
};
