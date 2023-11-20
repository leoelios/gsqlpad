export function addProtocolIfNecessary(host: string, insecure: boolean) {
  if (host.startsWith("http")) {
    return host;
  }

  return (insecure ? "http" : "https") + "://" + host;
}
