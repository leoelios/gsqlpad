import { ArgumentsCamelCase, BuilderCallback, CommandModule } from "yargs";

export default interface Command<T, U> {
  title: string;
  description: string;
  builder: BuilderCallback<T, U>;
  handler: (args: ArgumentsCamelCase<U>) => void | Promise<void>;
}
