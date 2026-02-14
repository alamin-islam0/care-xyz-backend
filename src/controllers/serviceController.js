import { Service } from "../models/Service.js";

export async function getServices(_req, res) {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    return res.status(200).json({ services });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch services", error: error.message });
  }
}

export async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ service });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch service", error: error.message });
  }
}
