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
});

router.post("/", (_req, res) => {
  res.render("ui/index.html", {
    title: "Domain Intelligence API - UI"
  });
});

router.get("/:domain", async (_req, res) => {
  try {
    const domainInfo = (await findAll()).find(x => x.domain === _req.params.domain);

    res.render("ui/single.html", {
      domainInfo
    });

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Failed to load data for domain"
    );
  }
});

export default router;