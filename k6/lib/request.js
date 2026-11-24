import { check } from "k6";
import encoding from "k6/encoding";
import http from "k6/http";

const baseUrl = __ENV.BASE_URL;
const endpoint = __ENV.ENDPOINT;
const bodyTemplate = __ENV.BODY_TEMPLATE;
const customerCount = Number(__ENV.CUSTOMER_COUNT ?? "1");
const successMarker = __ENV.SUCCESS_MARKER ?? "";
const extraHeaders = JSON.parse(__ENV.EXTRA_HEADERS ?? "{}");
const authHeader =
  __ENV.BASIC_AUTH === undefined || __ENV.BASIC_AUTH === ""
    ? {}
    : { authorization: `Basic ${encoding.b64encode(__ENV.BASIC_AUTH)}` };

export const SHARDS = Number(__ENV.SHARDS ?? "1");
export const SHARD = Number(__ENV.SHARD ?? "0");

export const randomIndex = () => Math.floor(Math.random() * customerCount);

export const requestOnce = (index) => {
  const body = bodyTemplate.replace("__N__", String((index % customerCount) + 1));
  const response = http.post(`${baseUrl}${endpoint}`, body, {
    headers: { ...authHeader, ...extraHeaders, "content-type": "application/json" },
    timeout: "120s",
  });
  check(response, {
    "status 200": (r) => r.status === 200,
    succeeded: (r) => typeof r.body === "string" && r.body.includes(successMarker),
  });
};
