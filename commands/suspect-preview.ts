import { Command } from "commander";
import { info } from "./common/console";
import fs from "fs";
import { readFile } from "./common/file";
const { execSync } = require('child_process')

const preview = new Command();
preview.parse(process.argv);

info("creating preview images");

const suspects = fs.readdirSync('./docs/_suspects');

for (const suspect of suspects) {
  console.log(suspect)
  const data = readFile(`./docs/_suspects/${suspect}`)
  const status = data.match(/.*status:(.*)\n/)[1].trim().toUpperCase();
  const image = data.match(/.*before:(.*\.png|.*\.jpg)\n/)[1].trim();

  const boxWidth = (function(status) {switch (status) {
      case "CHARGED":
        return 355;
      case "INDICTED":
        return 405;
      default:
        return 400;
    }
  })(status)

  execSync(`convert docs/images/before/${image} -resize 1200x -strokewidth 3 -fill red -draw "rectangle 0,0 ${boxWidth},100" -fill white -strokewidth 3 -fill white -stroke black -strokewidth 10 -pointsize 72 -font Courier-Bold -draw "text 25,65 '${status}'" -stroke none -draw "text 25,65 '${status}'" docs/images/preview/${image}`, {
    stdio: 'inherit'
  })
}
