import express from "express";
import nunjucks from "nunjucks";
import swaggerUi from "swagger-ui-express";
import domainRoutes from "./routes/domain.routes";
import swaggerSpec from "./config/swagger";
import errorHandler from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import path from "path";
import uiRoutes from "./routes/ui.routes";

const app = express();

app.use(express.json());

const env = nunjucks.configure(["src/views", "node_modules/govuk-frontend/dist/govuk/"], {
  autoescape: true,
  express: app
});

env.addFilter("parseJson", (value: string) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (err) {
    console.error("parseJson filter failed:", err);
    return null;
  }
});

const publicPath = path.resolve(
  process.cwd(),
  "public"
);

app.set("view engine", "html");
app.use('/assets', express.static(publicPath))
app.use(express.urlencoded({ extended: true }));
app.use("/api/domain", domainRoutes);
app.use("/ui/", uiRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.render("index.html", {
    title: "Domain Intelligence API"
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;