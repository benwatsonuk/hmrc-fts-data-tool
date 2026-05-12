// src/config/swagger.ts

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Domain Intelligence API",
      version: "1.0.0",
      description:
        "API for organisation/domain enrichment"
    }
  },
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;