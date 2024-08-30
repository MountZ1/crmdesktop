import express from "express";
import db from '../database/config.js'
import { authMiddleware, onlyAdmin } from '../middleware/index.js';

const report = express.Router();

report.get('/', onlyAdmin('/auth/dashboard'), (req, res) => {
    res.render('report', { user: req.session.user, title: "Report" });
})

report.get('/get', onlyAdmin('/auth/dashboard'), async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    // Query untuk mendapatkan detail report
    const reportDetail = await db('sales')
      .whereBetween('sales.created_at', [startDate, endDate])
      .where('sales.status_bayar', 'Lunas')
      .select(
        'sales.invoice',
        'sales.created_at',
        'sales.biaya_total as biaya'
      )
      .orderBy('sales.created_at');

    // Query untuk mendapatkan total dari biaya_total
    const totalResult = await db('sales')
      .whereBetween('sales.created_at', [startDate, endDate])
      .where('sales.status_bayar', 'Lunas')
      .sum('sales.biaya_total as total')
      .first();

    const total = totalResult ? parseFloat(totalResult.total) : 0;

    res.json({ 
      total: total,
      detail: reportDetail
    });
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({ message: 'Error getting report: ' + error.message });
  }
});

export default report;