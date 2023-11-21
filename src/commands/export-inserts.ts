import exportInserts from "../service/sqlpad/export-inserts";
import Command from "../types/command";

const command: Command<any, any> = {
  title: "export-inserts [instance] [table]",
  description: "export data using inserts SQL syntax",
  builder: (yargs) =>
    yargs
      .positional("table", {
        alias: "t",
        type: "string",
      })
      .positional("instance", {
        alias: "i",
        type: "string",
      }),
  handler: (yargs) => exportInserts(yargs.instance, yargs.table),
};

export default command;
