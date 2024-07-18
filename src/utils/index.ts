import fs from "fs";
import fsPromises from "fs/promises";
import { spawn } from "child_process";
import { Addressable } from "ethers";

export async function verifyContract(
  contractAddress: string | Addressable,
  contractSourceCode: string,
  contractName: string,
  constructorArguments?: string[]
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      const child = spawn(
        `npx hardhat verify --network sepolia ${contractAddress} ${constructorArguments?.join(
          " "
        )}`,
        {
          stdio: "inherit",
          shell: true,
        }
      );

      child.on("exit", function (code, signal) {
        if (code === 0) {
          resolve("done");
        } else {
          reject(
            new Error(
              `child process exited with code ${code} and signal ${signal}`
            )
          );
        }
      });

      child.on("error", (err) => {
        reject(err);
      });
    }, 60000);
  });
}
