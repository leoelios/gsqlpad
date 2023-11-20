import { configure } from "../service/sqlpad";
import Command from "../types/command";

const command: Command<any, any> = {
  title: "configure",
  description: "add a new SQLPad instance access configuration",
  builder: (yargs) => {
    return yargs
      .option("identifier", {
        description: "a name to be used to connect to instance",
      })
      .option("user", {
        description: "user credentials to authenticate",
        demandOption: true,
        type: "string",
      })
      .option("password", {
        description: "password credentials to authenticate",
        demandOption: true,
        type: "string",
      })
      .option("instance", {
        description: "instance host",
        demandOption: true,
      })
      .option("insecure", {
        description: "if the instance connection don't uses TLS",
        type: "boolean",
      });
  },
  handler: async (yargs) =>
    configure({
      instance: yargs.instance,
      password: yargs.password,
      user: yargs.user,
      identifier: yargs.identifier,
      insecure: yargs.insecure,
    }),
};

export default command;
