import { apiRoute } from "@game-cms/utils";
import { urlToHttpOptions } from "node:url";

export default apiRoute({
  url: `/entity/:entityId/list`,
  method: 'GET',
  handler: async (req, res) => {
    const { searchParams } = new URL(req.url);
  },
});
