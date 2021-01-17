import { Command } from "commander";
import { exitWithError, info } from "./common/console";
import fs from "fs";
import { readFile } from "./common/file";
const { execSync } = require('child_process')

const preview = new Command()
  .option("-f, --file <file>", "cropped file to use for preview")
  .option("-s, --status <status>", "status of suspect", "CHARGED")
  .option("-v, --verify", "verify all preview images exist");

preview.parse(process.argv);

const generatePreview = (previewImage, status) => {
  const width = (function(status) {switch (status) {
    case "CHARGED":
      return 185;
    case "INDICTED":
      return 205;
    default:
      return 200;
  }
  })(status)

  execSync(`convert docs/images/cropped/${previewImage} -strokewidth 3 -fill red -draw "rectangle 40,10 ${width},50" -fill white -strokewidth 3 -fill white -stroke black -strokewidth 10 -pointsize 32 -font Courier-Bold -draw "text 45,40 '${status}'" -stroke none -draw "text 45,40 '${status}'" docs/images/preview/${previewImage}`, {
    stdio: 'inherit'
  })
}

const doPreview = () => {
  const suspects = fs.readdirSync('./docs/_suspects');

  if (preview.verify) {
    for (const suspect of suspects) {
      const data = readFile(`./docs/_suspects/${suspect}`)
      const previewImage = data.match(/.*image:.*\/preview\/(.*\.png|.*\.jpg|.*\.webp)\n/)[1].trim();
      const file = `docs/images/preview/${previewImage}`;
      if (fs.existsSync(file)) {
        continue;
      } else {
        exitWithError(`No preview exists for ${suspect}`)
      }
    }
    return;
  }

  info("creating preview images");

  if (preview.file) {
    generatePreview(preview.file, "charged");
  } else {
    for (const suspect of suspects) {
      console.log(suspect)
      const data = readFile(`./docs/_suspects/${suspect}`)
      const status = data.match(/.*status:(.*)\n/)[1].trim().toUpperCase();
      const preview = data.match(/.*image:.*\/preview\/(.*\.png|.*\.jpg|.*\.webp)\n/)[1].trim();
      generatePreview(preview,status)
    }
  }
}

doPreview();
