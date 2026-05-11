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
const app = (0, express_1.default)();
app.use(express_1.default.json());
nunjucks_1.default.configure("src/views", {
    autoescape: true,
    express: app
});
app.set("view engine", "njk");
app.use("/api/domain", domain_routes_1.default);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.get("/", (_req, res) => {
    res.render("index.njk", {
        title: "Domain Intelligence API"
    });
});
exports.default = app;
