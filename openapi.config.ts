const { generateService } = require("@umijs/openapi");

generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath: "http://localhost:8010/api/v2/api-docs",
  serversPath: "./src",
});
