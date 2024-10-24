import { createHmac } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const sign = (secret: string, message: string) => {
  return createHmac("sha256", secret).update(message).digest("base64");
};

export const sleep = (milliseconds: number) =>
  new Promise((res) => {
    setTimeout(res, milliseconds);
  });

export const setup = () => {
  console.log("Checking setup ...");
  if (!fs.existsSync(path.join("/data", "config.json"))) {
    console.log("Creating config file ...");
    fs.writeFileSync(
      path.join("/data", "config.json"),
      fs.readFileSync("config.example.json"),
      "utf-8"
    );
  } else {
    console.log("Config already exists. Skipping ...");
  }
  return fs.readFileSync(path.join("/data", "config.json"));
};
