import { Request, Response } from 'express';
import Founder from '../models/Founder';
import cloudinary from '../config/cloudinary';

export const createOrUpdateFounder = async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;
    const files = req.files as Express.Multer.File[];

    const existingFounder = await Founder.findOne();
    
    let imageUrls: string[] = existingFounder?.images || [];
    
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'founder' });
        return result.secure_url;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    if (existingFounder) {
      existingFounder.name = name;
      existingFounder.message = message;
      existingFounder.images = imageUrls;
      await existingFounder.save();
      return res.json({ success: true, data: existingFounder });
    }

    const founder = await Founder.create({ name, message, images: imageUrls });
    res.json({ success: true, data: founder });
  } catch (error: any) {
    console.error('Founder error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFounder = async (req: Request, res: Response) => {
  try {
    const founder = await Founder.findOne();
    res.json({ success: true, data: founder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFounder = async (req: Request, res: Response) => {
  try {
    await Founder.deleteMany({});
    res.json({ success: true, message: 'Founder data deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
