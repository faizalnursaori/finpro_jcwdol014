import express from 'express';
import {
  getStockSummaryByMonth,
  getStockDetailsByMonth,
  salesReport,
  topCategories,
  topProducts,
} from '@/controllers/report.controller';

const router = express.Router();

router.get('/', salesReport);
router.get('/products', topProducts);
router.get('/categories', topCategories);
router.get('/stock-summary', async (req, res) => {
  const { warehouseId, month, year } = req.query;

  if (!warehouseId || !month || !year) {
    return res.status(400).json({
      message: 'Missing required parameters: warehouseId, month, year',
    });
  }

  try {
    const summary = await getStockSummaryByMonth(
      Number(warehouseId),
      Number(month),
      Number(year),
    );
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching stock summary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/stock-details', async (req, res) => {
  const { warehouseId, month, year } = req.query;

  if (!warehouseId || !month || !year) {
    return res.status(400).json({
      message: 'Missing required parameters: warehouseId, month, year',
    });
  }

  try {
    const stockDetails = await getStockDetailsByMonth(
      Number(warehouseId),
      Number(month),
      Number(year),
    );

    return res.status(200).json(stockDetails);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export const reportRouter = router;
