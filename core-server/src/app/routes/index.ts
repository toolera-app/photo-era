import express from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PromQLRoutes } from "../modules/promql_matrix/metrics.route";
import { photoEra } from "../modules/photoEra/photoEra.route";
import { PerImageCreditRoutes } from "../modules/perImageCredit/perImageCredit.routes";
import { OrderRoutes } from "../modules/order/order.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/metrics",
    route: PromQLRoutes,
  },
  {
    path: "/photo",
    route: photoEra,
  },
  {
    path: "/per-image-credit",
    route: PerImageCreditRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
