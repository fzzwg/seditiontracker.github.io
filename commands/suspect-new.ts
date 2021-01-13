import { Command } from "commander";
import { info } from "./common/console";
import fs from "fs";
import { readFile } from "./common/file";
const { execSync } = require('child_process')
import inquirer from 'inquirer';
import { padStart } from "lodash";


const cmd = new Command();
cmd.parse(process.argv);

const newSuspect = async() => {
  // go through and find the last number used
  const files = fs.readdirSync("./docs/images/before");
  const number = parseInt(files[files.length - 1].replace("0", "")) + 1;
  const id = padStart(number.toString(), 3, "0");

  info(`creating new suspect with id: ${id}`);

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "Name"
    },
    {
      type: 'number',
      name: 'age',
      message: "Age"
    },
    {
      type: "input",
      name: "residence",
      message: "Residence"
    },
    {
      type: "input",
      name: "date",
      message: "Date (YYYY-MM-DD)"
    },
    {
      type: "list",
      name: "status",
      choices: ["Charged", "Indicted"],
      message: "Status",
    },
  ]

  const template = readFile("./commands/common/template.md");
  const result = await inquirer.prompt(questions)
  const date = Date.parse(result.date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateFormat = new Intl.DateTimeFormat('en-US', options).format(date)
  const name = result.name.replace(" ", "-").toLowerCase();
  const action = result.status.toLowerCase();

  let data = template.replace(/\[name]/g, result.name,);
  data = data.replace("[residence]", result.residence);
  data = data.replace("[status]", result.status);
  data = data.replace("[age]", result.age);
  data = data.replace("[date]", result.date);
  data = data.replace("[longDate]", dateFormat);
  data = data.replace("[action]", action);
  data = data.replace("[id]", id);

  fs.writeFileSync(`./docs/_suspects/${name}.md`, data.toString());

  console.log(result.status)
}

newSuspect();
