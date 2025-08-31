import fs from "fs";
import path from "path";
import { infoLogger } from "../shared/logger";

const create_required_directories = () => {
  /**
   * Create required directories if they do not exist during application startup.
   **/

  const baseDir = "./data/uploads";

  const directories = [
    "./data",
    baseDir,
    path.join(baseDir, "event-images"),
    path.join(baseDir, "profile-images"),
    path.join(baseDir, "vendor-images"),
    path.join(baseDir, "advertisement-images"),
    path.join(baseDir, "venue-images"),
    path.join(baseDir, "event-category-images"),
    path.join(baseDir, "product-category-images"),
    path.join(baseDir, "products-images"),
    path.join(baseDir, "reviews-images"),
    path.join(baseDir, "promotion-type-images"),
    path.join(baseDir, "promotion-images"),
    path.join(baseDir, "blog-images"),
    path.join(baseDir, "ticket-design-template-images"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  infoLogger.info("Directories successfully created on API Gateway!");
};

export default create_required_directories;
