import Command from "../types/command";

const command: Command<any, any> = {
  title: "import-config",
  description: "import a entire config file to be used",
  builder: (yargs) => {
    return yargs;
  },
  handler: (yargs) => {
    // TODO: implement import-config command for import a entirely config file
  },
};

export default command;
