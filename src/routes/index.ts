import { Router } from "express";
import { compile } from "../controllers/Contracts";

const router = Router();

router.post("/compile", compile);
