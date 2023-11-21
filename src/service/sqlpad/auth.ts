import SQLPadInstanceClient from "../../client/sqlpad";
import Session from "../../types/session";
import { addProtocolIfNecessary } from "../../utils/args";
import { hash } from "../../utils/hash";
import { saveInstance } from "../../utils/local-config";

export async function generateSession({
  instance,
  insecure = false,
  user,
  password,
  identifier = hash(10),
}: {
  instance: string;
  insecure?: boolean;
  user: string;
  password: string;
  identifier?: string;
}): Promise<Session> {
  const instanceURI = addProtocolIfNecessary(instance, insecure);

  console.log("\n🟢 Instance network connection checked");

  const client = new SQLPadInstanceClient(instanceURI);

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

  return session!;
}
