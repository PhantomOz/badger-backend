import { Request, Response } from "express";
import { compileContract } from "../utils";

export async function compile(req: Request, res: Response) {
  let { name, contract } = req.body;
  try {
    const compiledContract = await compileContract(name, contract);
    res.status(200).json({ data: compiledContract });
  } catch (e: any) {
    res.status(500).json(e);
  }
}
