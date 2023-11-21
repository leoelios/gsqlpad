import query from "../service/sqlpad/query";
import Command from "../types/command";

const command: Command<any, any> = {
  title: "query [instanceId]",
  description: "execute a query to a target instance",
  builder: (yargs) => {
    return yargs.positional("instanceId", {
      type: "string",
    });
  },
  handler: ({ instanceId }) => query(instanceId),
};

export default command;
