import express, { NextFunction, Request, Response } from "express";

import configSchema from "./config/config.schema";
import envSchema from "./config/environment.schema";
import eWeLink from "./classes/ewelink.class";

import { Media } from "./enums/media.enum";
import constants from "./constants";
import multer from "multer";
import ip from "ip";
import { setup } from "./utils";

import "dotenv/config";

const buffer = setup();
const upload = multer();

const app = express();

const env = envSchema.parse(process.env);
const config = configSchema.parse(JSON.parse(buffer.toString("utf-8")));

const port = env.PORT || constants.defaultPort;
const ipAddress = ip.address();

app.post(
  "/webhook",
  upload.single("thumb"),
  async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload);
    if (payload && payload.event) {
      const player = payload.Player.uuid as string;
      const event = payload.event;

      if (config.players.includes(player)) {
        try {
          const client = new eWeLink({
            email: env.EWELINK_ACCOUNT,
            password: env.EWELINK_PASSWORD,
            countryCode: env.EWELINK_AREA,
          });

          await client.login();

          if (event === Media.Play) {
            await client.updateDevices(config.devices.outlets, (device) =>
              eWeLink.actions.outlets(device.switches, "off")
            );
          }

          if ([Media.Play, Media.Resume].includes(event)) {
            await client.updateDevices(config.devices.dimmables, () =>
              eWeLink.actions.dim(10)
            );
          }

          if (event === Media.Scrobble) {
            await client.updateDevices(config.devices.dimmables, () =>
              eWeLink.actions.dim(70)
            );
          }

          if (event === Media.Pause) {
            await client.updateDevices(config.devices.dimmables, () =>
              eWeLink.actions.dim(40)
            );
          }

          if (event === Media.Stop) {
            await client.updateDevices(config.devices.dimmables, () =>
              eWeLink.actions.dim(100)
            );
          }
        } catch {
          console.log("Something went wrong");
        }
      } else {
        console.log(`Skipping player with player uuid '${player}' ...`);
      }
    }

    res.sendStatus(200);
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port} ...`);
  console.log(`ℹ️  Set Plex webhook to http://${ipAddress}:${port}/webhook`);
});
