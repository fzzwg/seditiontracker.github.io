import { Command } from "commander";
import { head, includes, map } from "lodash";
import { error } from "./common/console";

const suspect = new Command()
  .command("preview", "creates a preview image for the suspect")
  .command("new", "adds a template for a new suspect")
suspect.parse(process.argv);

const subCmd = head(suspect.args);
const cmds = map(suspect.commands, "_name");

if (!includes(cmds, subCmd)) {
  error("unknown command");
  suspect.help();
}
