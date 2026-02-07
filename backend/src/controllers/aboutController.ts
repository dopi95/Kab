import { Request, Response } from 'express';
import About from '../models/About';

export const getAbout = async (req: Request, res: Response) => {
  try {
    const about = await About.findOne({ isActive: true });
    res.json(about || { content: '' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    
    let about = await About.findOne();
    
    if (about) {
      about.content = content;
      await about.save();
    } else {
      about = await About.create({ content });
    }
    
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
