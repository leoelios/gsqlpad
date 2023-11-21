import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import commands from "./commands";
import { printBanner } from "./utils/banner";

const cli = yargs(hideBin(process.argv));

printBanner();

commands.forEach((command) => {
  cli.command(
    command.title,
    command.description,
    command.builder,
    command.handler
  );
});

cli.parse();
