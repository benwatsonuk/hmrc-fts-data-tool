"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const domain_routes_1 = __importDefault(require("./routes/domain.routes"));
const swagger_1 = __importDefault(require("./config/swagger"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
nunjucks_1.default.configure(["src/views", "node_modules/govuk-frontend/dist/govuk/"], {
    autoescape: true,
    express: app
});
const publicPath = path_1.default.resolve(process.cwd(), "public");
app.set("view engine", "html");
app.use('/assets', express_1.default.static(publicPath));
app.use("/api/domain", domain_routes_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get("/", (_req, res) => {
    res.render("index.html", {
        title: "Domain Intelligence API"
    });
});
app.use(not_found_1.default);
app.use(error_handler_1.default);
exports.default = app;
