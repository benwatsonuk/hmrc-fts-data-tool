// src/routes/domain.routes.ts

import { Router } from "express";

const router = Router();

router.get(
  "/",
  (_req, res) => {
    res.render("ui/index.html", {
      title: "Domain Intelligence API - UI"
    });
  }
);

export default router;