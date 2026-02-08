import { Request, Response } from 'express';
import Portfolio from '../models/Portfolio';
import cloudinary from '../config/cloudinary';

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }
    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const { aboutText, experienceYears } = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({ aboutText, experienceYears });
    } else {
      portfolio.aboutText = aboutText;
      portfolio.experienceYears = experienceYears;
      await portfolio.save();
    }
    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkills = async (req: Request, res: Response) => {
  try {
    const { skills } = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({ skills });
    } else {
      portfolio.skills = skills;
      await portfolio.save();
    }
    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperiences = async (req: Request, res: Response) => {
  try {
    const { experiences } = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({ experiences });
    } else {
      portfolio.experiences = experiences;
      await portfolio.save();
    }
    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSampleWork = async (req: Request, res: Response) => {
  try {
    const { title, description, type, youtubeUrl } = req.body;
    const files = req.files as Express.Multer.File[];
    
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }

    const mediaUrls: string[] = [];
    
    if (type !== 'youtube' && files && files.length > 0) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const uploadOptions: any = { 
          folder: 'portfolio_works',
          resource_type: type === 'video' ? 'video' : 'image'
        };
        
        if (type === 'video') {
          uploadOptions.chunk_size = 6000000;
          uploadOptions.eager_async = true;
        }
        
        const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
        mediaUrls.push(result.secure_url);
      }
    }

    portfolio.sampleWorks.push({ title, description, type, mediaUrls, youtubeUrl });
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSampleWork = async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    const { title, description, type, youtubeUrl, removeIndices } = req.body;
    const files = req.files as Express.Multer.File[];
    
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const idx = parseInt(index);
    if (idx < 0 || idx >= portfolio.sampleWorks.length) {
      return res.status(400).json({ success: false, message: 'Invalid index' });
    }

    let mediaUrls = portfolio.sampleWorks[idx].mediaUrls || [];
    
    // Remove selected media
    if (removeIndices) {
      const indicesToRemove = JSON.parse(removeIndices);
      mediaUrls = mediaUrls.filter((_, i) => !indicesToRemove.includes(i));
    }
    
    // Add new media files
    if (type !== 'youtube' && files && files.length > 0) {
      for (const file of files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const uploadOptions: any = { 
          folder: 'portfolio_works',
          resource_type: type === 'video' ? 'video' : 'image'
        };
        
        if (type === 'video') {
          uploadOptions.chunk_size = 6000000;
          uploadOptions.eager_async = true;
        }
        
        const result = await cloudinary.uploader.upload(dataURI, uploadOptions);
        mediaUrls.push(result.secure_url);
      }
    }

    portfolio.sampleWorks[idx] = { title, description, type, mediaUrls, youtubeUrl };
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSampleWork = async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const idx = parseInt(index);
    if (idx < 0 || idx >= portfolio.sampleWorks.length) {
      return res.status(400).json({ success: false, message: 'Invalid index' });
    }

    portfolio.sampleWorks.splice(idx, 1);
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addHeroImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = await Portfolio.create({});
    }

    if (portfolio.heroImages.length >= 3) {
      return res.status(400).json({ success: false, message: 'Maximum 3 images allowed' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'portfolio_hero' });

    portfolio.heroImages.push(result.secure_url);
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHeroImage = async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const idx = parseInt(index);
    if (idx < 0 || idx >= portfolio.heroImages.length) {
      return res.status(400).json({ success: false, message: 'Invalid index' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'portfolio_hero' });

    portfolio.heroImages[idx] = result.secure_url;
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHeroImage = async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const idx = parseInt(index);
    if (idx < 0 || idx >= portfolio.heroImages.length) {
      return res.status(400).json({ success: false, message: 'Invalid index' });
    }

    portfolio.heroImages.splice(idx, 1);
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
