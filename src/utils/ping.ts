import { promise } from "ping";
import { URL } from "url";

export default async (host: string): Promise<boolean> => {
  const hostname = new URL(host).hostname;

  return (await promise.probe(hostname)).alive;
};
