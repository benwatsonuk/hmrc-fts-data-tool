// src/routes/domain.routes.ts

import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.render("ui/index.html", {
    title: "Domain Intelligence API - UI"
  });
});

router.post("/", (_req, res) => {
  res.render("ui/index.html", {
    title: "Domain Intelligence API - UI"
  });
});

router.get("/:id", (_req, res) => {
  const domainInfo = { title: "hello" }
  res.render("ui/single.html", {
    title: "Domain Intelligence API - UI",
    domainInfo: domainInfo
  });
});

export default router;