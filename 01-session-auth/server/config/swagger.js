const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Session Auth API",
      version: "1.0.0",
      description: "A secure MERN session-based authentication API with CSRF protection, rate limiting, and centralized error handling.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
        },
        csrfAuth: {
          type: "apiKey",
          in: "header",
          name: "x-csrf-token",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

module.exports = specs;
