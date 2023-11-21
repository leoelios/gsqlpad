import { addProtocolIfNecessary } from "../utils/args";
import { hash } from "../utils/hash";
import { saveInstance } from "../utils/local-config";
import ping from "../utils/ping";
import { generateSession } from "./sqlpad/auth";

export async function configure({
  instance,
  user,
  password,
  insecure,
  identifier,
}: {
  instance: string;
  user: string;
  password: string;
  identifier?: string;
  insecure: boolean;
}) {
  try {
    const instanceURI = addProtocolIfNecessary(instance, insecure);

    await generateSession({
      instance,
      insecure,
      user,
      password,
      identifier,
    });
  } catch (error) {
    console.error(`🔴 ${error}`);
    console.debug(error);
  }
}
