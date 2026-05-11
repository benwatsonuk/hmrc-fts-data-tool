import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Domain Intelligence API",
      version: "1.0.0"
    }
  },
  apis: ["./src/routes/*.ts"]
};

export default swaggerJsdoc(options);