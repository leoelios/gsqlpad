import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands";

const cli = yargs(hideBin(process.argv));

commands.forEach((command) => {
  cli.command(
    command.title,
    command.description,
    command.builder,
    command.handler
  );
});

cli.parse();
