import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

async function run() {
    const { runGit } = await import("./utils.js");
    const importDefault = async (module) => (await import(module)).default;
    const minimist = await importDefault("minimist");
    const params = minimist(process.argv.slice(2), {
        string: ["version"],
        boolean: ["dry"],
        alias: { v: "version" },
    });
    // let fs = require('fs');
    // const { stdout: previousVersion } = await runGit([
    //     "describe",
    //     "--tags",
    //     "--abbrev=0",
    //   ]);
    // console.log(previousVersion);
    // fs.readFile(someFile, 'utf8', function (err,data) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     var result = data.replace(/string to be replaced/g, 'replacement');
      
    //     fs.writeFile(someFile, result, 'utf8', function (err) {
    //        if (err) return console.log(err);
    //     });
    //   });
}


exec(
    [
    //   "git fetch --tags", // Fetch git tags to get the previous version number (i.e. the latest tag)
        "echo hello"
    ].join(" && "),
    (error) => {
      if (error) {
        console.error(error);
        process.exit(1);
      } else {
        run();
      }
    }
  );