import fs from "fs";
import fsPromises from "fs/promises";
import { spawn } from "child_process";
import { Request, Response } from "express";

export async function compile(req: Request, res: Response) {
  let { name, contract } = req.body;
  name = name.replace(" ", "");
  (async function main() {
    try {
      await fsPromises.writeFile("../../contracts/Lock.sol", contract);

      console.log("File written successfully");
      console.log("The written file has" + " the following contents:");

      console.log("" + fs.readFileSync("../../contracts/Lock.sol"));
    } catch (err) {
      console.error(err);
    }
  })();

  const child = spawn("npx hardhat compile", {
    stdio: "inherit",
    shell: true,
  });

  return new Promise<string>((resolve, reject) => {
    child.on("exit", function (code, signal) {
      if (code === 0) {
        try {
          let compiledContract = fs.readFileSync(
            `../../artifacts/contracts/Lock.sol/${name}.json`,
            "utf8"
          );
          resolve(compiledContract);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(
          new Error(
            `child process exited with code ${code} and signal ${signal}`
          )
        );
      }
    });
  });
}
