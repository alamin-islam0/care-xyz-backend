import { Router } from "express";
import { getServiceById, getServices } from "../controllers/serviceController.js";

const router = Router();

router.get("/", getServices);
router.get("/:serviceId", getServiceById);

export default router;
