# Plex Sonoff Controller
![Docker Image Version](https://img.shields.io/docker/v/salimmajzoub/plex-sonoff-controller)
[![Docker Image](https://img.shields.io/docker/pulls/salimmajzoub/plex-sonoff-controller)](https://hub.docker.com/r/salimmajzoub/plex-sonoff-controller)

This project enhances your home media setup by responding to Plex events (like play, pause, or stop) to control smart plugs and lights — giving you a cinema-style experience that automatically dims the lights when the movie starts and brings them back when it ends.

## Requirements

* Plex Media Server with webhooks enabled (requires Plex Pass).
* Sonoff devices with eWeLink setup


## Installation

```bash
git clone https://github.com/salim-m/plex-sonoff-controller.git
cd plex-sonoff-controller
npm install
npm start
```



## Configuration

Modify the `config.json` file located in the root of the project

```json
{
  "players": ["plex-player-id"],
  "devices": {
    "outlets": [
      {
        "id": "1000abcd12",
        "switches": 2
      }
    ],
    "dimmables": [
      {
        "id": "1000efgh34"
      }
    ]
  }
}
```

### Explanation

* `players`: List of Plex player IDs to monitor (from webhook payloads).
* `devices.outlets`:

  * `id`: Device ID from eWeLink (e.g., `1000abcd12`)
  * `switches`: Number of controllable switches.
* `devices.dimmables`:

  * `id`: Device ID of the dimmable device.

## Usage

Once running, set your Plex Webhook URL to:

```
http://<your_host>:<port>/webhook
```


## How It Works

1. Plex triggers a webhook when media plays, pauses, resumes, or stops.
2. The controller filters events based on configured player IDs.
3. It then uses the eWeLink API to:

   * Toggle outlets on or off
   * Adjust dimmable lights
