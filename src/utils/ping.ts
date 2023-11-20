import ping from "ping";
import util from "util";
import { URL } from "url";

export default async (host: string): Promise<boolean> => {
  const hostname = new URL(host).hostname;

  return (await ping.promise.probe(hostname)).alive;
};
