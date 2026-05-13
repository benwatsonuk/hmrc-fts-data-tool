// src/routes/domain.routes.ts

import { Router } from "express";
import { findAll } from "../database/organisation.repository";
import { or } from "ajv/dist/compile/codegen";


const router = Router();

router.get("/", async (_req, res) => {

  try {
    const cachedData = await findAll();

    res.render("ui/index.html", {
      title: "Domain Intelligence API - UI",
      cachedData
    });

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Failed to load organisations"
    );
  }
  // res.render("ui/index.html", {
  //   title: "Domain Intelligence API - UI"
  // });
});

router.post("/", (_req, res) => {
  res.render("ui/index.html", {
    title: "Domain Intelligence API - UI"
  });
});

router.get("/:id", async (_req, res) => {
  const domainInfo = { title: "hello" }
  res.render("ui/single.html", {
    title: "Domain Intelligence API - UI",
    domainInfo: domainInfo
  });
});

export default router;