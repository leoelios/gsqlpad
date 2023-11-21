import Instance from "../types/Instance";
import InstanceStatus from "../types/InstanceStatus";
import Command from "../types/command";
import { getInstances, isInstanceExpired } from "../utils/local-config";

const command: Command<any, any> = {
  title: "instances",
  description: "List all available instances",
  builder: (yargs) => {
    // TODO: add identifier and instance URI filters
    return yargs;
  },
  handler: async (_) => {
    const instances = getInstances();

    console.table(
      instances.map((instance) => ({
        id: instance.identifier,
        host: instance.instance,
        user: instance.user,
        status: status(instance),
      }))
    );
  },
};

function status(instance: Instance) {
  if (isInstanceExpired(instance)) {
    InstanceStatus.expired;
  }

  return InstanceStatus.authenticated;
}

export default command;
