import axios from "axios";
import cookie from "cookie";
import Session from "../types/session";

interface AuthenticationResponse {
  authenticated: boolean;
  session?: Session;
  raw: object;
}

export default class SQLPadInstanceClient {
  instance: string;

  /** true if this connection must not use TLS */
  insecure: boolean;

  constructor(instance: string, insecure: boolean = false) {
    this.instance = instance;
    this.insecure = insecure;
  }

  async authenticate({
    user,
    password,
  }: {
    user: string;
    password: string;
  }): Promise<AuthenticationResponse> {
    const response = await axios.post(
      this.instance + "/api/signin",
      {
        email: user,
        password,
      },
      {
        validateStatus: null,
      }
    );

    if (response.status === 200) {
      const authCookie = response.headers["set-cookie"]
        ?.map((item) => cookie.parse(item))
        .find((cookie) => Object.hasOwn(cookie, "sqlpad.sid"));

      if (!authCookie) {
        throw new Error("SQLPad authentication cookie not found");
      }

      return {
        authenticated: true,
        session: {
          id: authCookie["sqlpad.sid"],
          expiresIn: new Date(authCookie.Expires),
        },
        raw: authCookie,
      };
    }

    return {
      authenticated: false,
      raw: response.data,
    };
  }
}
