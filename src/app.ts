import express from "express";
import nunjucks from "nunjucks";
import swaggerUi from "swagger-ui-express";
import domainRoutes from "./routes/domain.routes";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(express.json());

nunjucks.configure("src/views", {
  autoescape: true,
  express: app
});

app.set("view engine", "njk");

app.use("/api/domain", domainRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.render("index.njk", {
    title: "Domain Intelligence API"
  });
});

export default app;