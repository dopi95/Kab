import { Request, Response } from 'express';
import FAQ from '../models/FAQ';

export const getFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer, order } = req.body;
    const faq = await FAQ.create({ question, answer, order });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
