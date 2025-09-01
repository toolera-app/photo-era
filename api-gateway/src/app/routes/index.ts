import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { CustomerUserRoutes } from "../modules/users/customer/customer.routes";

import { BlogCategoryRoutes } from "../modules/blogCategory/blogCategory.routes";
import { BlogRoutes } from "../modules/blogs/blogs.routes";

import { PromQLRoutes } from "../modules/promql_matrix/metrics.route";
import { PerImageCreditRoutes } from "../modules/perImageCredit/perImageCredit.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { photoEraRoutes } from "../modules/photo-era/photo-era.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/users",
    routes: CustomerUserRoutes,
  },
  {
    path: "/blog-categories",
    routes: BlogCategoryRoutes,
  },
  {
    path: "/blogs",
    routes: BlogRoutes,
  },
  {
    path: "/metrics",
    routes: PromQLRoutes,
  },
  {
    path: "/per-image-credit",
    routes: PerImageCreditRoutes,
  },
  {
    path: "/orders",
    routes: OrderRoutes,
  },
  {
    path: "/photo",
    routes: photoEraRoutes,
  },
  {
    path: "/metrics",
    routes: PromQLRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;
