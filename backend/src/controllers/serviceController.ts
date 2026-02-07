import { Request, Response } from 'express';
import Service from '../models/Service';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { title, description, icon, isActive, order } = req.body;
    const service = new Service({ title, description, icon, isActive, order });
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { title, description, icon, isActive, order } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = title ?? service.title;
    service.description = description ?? service.description;
    service.icon = icon ?? service.icon;
    service.isActive = isActive ?? service.isActive;
    service.order = order ?? service.order;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
