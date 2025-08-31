import { Request, Response, NextFunction } from "express";
import { httpRequestCounter, httpRequestDuration } from "../../shared/prometheus";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    let routePath: string;

    if (req.route && req.baseUrl) {
      routePath = `${req.baseUrl}${req.route.path}`;
    } else if (req.originalUrl) {
      routePath = req.originalUrl.split("?")[0];
    } else {
      routePath = req.path;
    }

    console.log("✅ Tracked:", req.method, routePath, res.statusCode);

    httpRequestDuration.labels(req.method, routePath, res.statusCode.toString()).observe(duration);

    httpRequestCounter.labels(req.method, routePath, res.statusCode.toString()).inc();
  });

  next();
};
