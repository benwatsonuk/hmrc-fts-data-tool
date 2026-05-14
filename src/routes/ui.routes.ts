// src/routes/domain.routes.ts

import { Router } from "express";
import { findAll } from "../database/organisation.repository";
import domainService from "../services/domain.service";

const router = Router();

const getCachedData = async (res: any) => {
  try {
    const cachedData = await findAll();

    console.log(`Loaded ${cachedData.length} cached organisations`);

    return cachedData;

  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Failed to load organisations"
    );
  }
}

router.get("/", async (_req, res) => {

  const cachedData = await getCachedData(res);

  res.render("ui/index.html", {
    title: "Domain Intelligence API - UI",
    cachedData
  });
});

router.post("/", async (_req, res) => {
  const cachedData = await getCachedData(res);

  try {

    const domain = _req.body.domain?.trim();

    if (!domain) {
      res.render("ui/index.html", {
        title: "Domain Intelligence API - UI",
        error: "Please enter a domain name",
        cachedData
      });
    } else {
      const result = await domainService.lookup(domain);

      return res.redirect(`/ui/${domain}`);
    }

  } catch (error) {
    console.error(error);

    return res.status(500).render(
      "ui/index.html",
      {
        cachedData,
        error:
          "Something went wrong while looking up the domain. Please try again."
      }
    );
  }
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