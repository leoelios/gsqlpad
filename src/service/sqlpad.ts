import SQLPadInstanceClient from "../client/sqlpad";
import { addProtocolIfNecessary } from "../utils/args";
import { hash } from "../utils/hash";
import { saveInstance } from "../utils/local-config";
import ping from "../utils/ping";

export async function configure({
  instance,
  user,
  password,
  insecure,
  identifier = hash(10),
}: {
  instance: string;
  user: string;
  password: string;
  identifier?: string;
  insecure: boolean;
}) {
  try {
    const instanceURI = addProtocolIfNecessary(instance, insecure);

    if (!(await isInstanceAvailable(instanceURI))) {
      throw new Error(
        `Instance "${instance}" not available from this host, verify your proxy or VPN network configuration.`
      );
    }

    console.log("\n🟢 Instance network connection checked");

    const client = new SQLPadInstanceClient(instanceURI, insecure);

    const { authenticated, session } = await client.authenticate({
      user,
      password,
    });

    if (!authenticated) {
      throw new Error(
        "Authentication failed, please check the credentials specified."
      );
    }

    console.log("\n🟢 Authenticated successfully", session);

    saveInstance({
      identifier,
      instance: instanceURI,
      user,
      password,
      session: session!,
    });
  } catch (error) {
    console.error(`🔴 ${error}`);
    console.debug(error);
  }
}

async function isInstanceAvailable(host: string) {
  return ping(host);
}
