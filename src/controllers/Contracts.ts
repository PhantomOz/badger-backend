import { Request, Response } from "express";

export async function compile(req: Request, res: Response) {
  let { name, contract } = req.body;
  name = name.replace(" ", "");
}
