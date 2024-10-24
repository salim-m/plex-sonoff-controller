import { sign } from "../utils";
import constants from "../constants";
import apisauce from "apisauce";

const client = apisauce.create({ baseURL: "https://eu-apia.coolkit.cc/v2" });

client.axiosInstance.interceptors.request.use((config) => {
  const signature = sign(constants.appSecret, JSON.stringify(config.data));
  const nonce = Math.random().toString(36).substring(2, 10);

  if (!config.headers.hasAuthorization()) {
    config.headers.set("Authorization", `Sign ${signature}`);
  }
  config.headers.set("X-CK-Appid", constants.appId);
  config.headers.set("X-CK-Nonce", nonce);

  return config;
});

export default client;
