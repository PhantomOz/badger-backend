"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileContract = compileContract;
exports.verifyContract = verifyContract;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const child_process_1 = require("child_process");
const ethers_1 = require("ethers");
const code = new ethers_1.AbiCoder();
console.log((0, ethers_1.solidityPacked)(["string"], [
    `// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GettingCode is ERC20 {
    constructor() ERC20("Getting Code", "GCT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}`,
]));
// console.log(
//   "\n Here is Bytes32: ",
//   encodeBytes32String(
//     solidityPacked(
//       ["string"],
//       [
//         `// SPDX-License-Identifier: MIT
// // Compatible with OpenZeppelin Contracts ^5.0.0
// pragma solidity ^0.8.20;
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// contract GettingCode is ERC20 {
//     constructor() ERC20("Getting Code", "GCT") {
//         _mint(msg.sender, 1000 * 10 ** decimals());
//     }
// }`,
//       ]
//     )
//   )
// );
async function compileContract(name, contract) {
    name = name.replace(" ", "");
    contract = ethers_1.ethers.toUtf8String(contract);
    console.log(contract);
    (async function main() {
        try {
            await promises_1.default.writeFile("contracts/Lock.sol", contract);
            console.log("File written successfully");
            console.log("The written file has" + " the following contents:");
            console.log("" + fs_1.default.readFileSync("contracts/Lock.sol"));
        }
        catch (err) {
            console.error(err);
        }
    })();
    const child = (0, child_process_1.spawn)("npx hardhat compile", {
        stdio: "inherit",
        shell: true,
    });
    return new Promise((resolve, reject) => {
        child.on("exit", function (code, signal) {
            if (code === 0) {
                try {
                    let compiledContract = fs_1.default.readFileSync(`artifacts/contracts/Lock.sol/${name}.json`, "utf8");
                    resolve(compiledContract);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(new Error(`child process exited with code ${code} and signal ${signal}`));
            }
        });
    });
}
async function verifyContract(contractAddress, contractSourceCode, contractName, constructorArguments) {
    await compileContract(contractName, contractSourceCode);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const child = (0, child_process_1.spawn)(`npx hardhat verify --network sepolia ${contractAddress} ${constructorArguments?.join(" ")}`, {
                stdio: "inherit",
                shell: true,
            });
            child.on("exit", function (code, signal) {
                if (code === 0) {
                    resolve("done");
                }
                else {
                    reject(new Error(`child process exited with code ${code} and signal ${signal}`));
                }
            });
            child.on("error", (err) => {
                reject(err);
            });
        }, 60000);
    });
}
