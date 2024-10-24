import client from "../api/client";
import constants from "../constants";

type LoginArgs = {
  email: string;
  password: string;
  countryCode: string;
};

type Redirect = {
  region: string;
};

type Device = { id: string; type?: number };

type LoginResponse =
  | { error: 0; data: { at: string } }
  | { error: 10004; data: Redirect };

export default class eWeLink {
  private readonly client = client;
  private token = "";
  private region = "eu";

  constructor(private readonly params: LoginArgs) {}

  async login(): Promise<void> {
    const response = await this.client.post<LoginResponse>("/user/login", {
      email: this.params.email,
      password: this.params.password,
      countryCode: this.params.countryCode,
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    if (!response.data) {
      throw new Error();
    }

    if (response.data.error === 10004) {
      this.region = response.data.data.region;
      this.client.setBaseURL(this.baseUrl);

      console.log(`Redirecting to '${this.region}' region ...`);

      return await this.login();
    }

    this.token = response.data.data.at;

    console.log("Login successful ...");
  }

  async updateDevices(devices: Device[], params: (device: any) => object) {
    return await this.client.post(
      "/device/thing/batch-status",
      {
        thingList: devices.map((device) => ({
          type: 1,
          id: device.id,
          params: params(device),
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  static get actions() {
    return {
      dim: (brightness: number) => ({
        white: { br: brightness },
      }),
      outlets: (switches = 1, state: "on" | "off") => ({
        switches: Array(switches)
          .fill(0)
          .map((_, i) => ({
            switch: state,
            outlet: i,
          })),
      }),
    };
  }

  private get baseUrl() {
    const region = this.region;

    if (!constants.regions.includes(region)) throw new Error("Invalid region");
    if (region === "cn") return "https://cn-apia.coolkit.cn/v2";
    return `https://${region}-apia.coolkit.cc/v2`;
  }
}
