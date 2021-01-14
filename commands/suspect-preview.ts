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
  const image = data.match(/.*before:(.*\.png|.*\.jpg|.*\.webp)\n/)[1].trim();

  const boxWidth = (function(status) {switch (status) {
      case "CHARGED":
        return 185;
      case "INDICTED":
        return 200;
      default:
        return 200;
    }
  })(status)

  execSync(`convert docs/images/cropped/${image} -strokewidth 3 -fill red -draw "rectangle 40,10 ${boxWidth},50" -fill white -strokewidth 3 -fill white -stroke black -strokewidth 10 -pointsize 32 -font Courier-Bold -draw "text 45,40 '${status}'" -stroke none -draw "text 45,40 '${status}'" docs/images/preview/${image}`, {
    stdio: 'inherit'
  })
}
