import { Router } from "express";
import { getDomainInfo } from "../controllers/domain.controller";

const router = Router();

router.get("/:domain", getDomainInfo);

export default router;