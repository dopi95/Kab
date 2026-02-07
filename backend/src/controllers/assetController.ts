import { Request, Response } from 'express';
import Asset from '../models/Asset';
import cloudinary from '../config/cloudinary';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const sendAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, type, url, text } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ success: false, message: 'User and type are required' });
    }

    let assetUrl = url;

    if (type === 'photo' && req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map(async (file: any) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'user_assets',
          resource_type: 'auto'
        });

        return Asset.create({
          userId,
          type,
          url: result.secure_url,
          text: text || ''
        });
      });

      const assets = await Promise.all(uploadPromises);
      return res.status(201).json({ success: true, data: assets });
    }

    if (!assetUrl) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const asset = await Asset.create({
      userId,
      type,
      url: assetUrl,
      text: text || ''
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserAssetsByAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const assets = await Asset.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getUserAssets = async (req: AuthRequest, res: Response) => {
  try {
    const assets = await Asset.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    const asset = await Asset.findByIdAndUpdate(id, { text }, { new: true });
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByIdAndDelete(id);
    
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
