const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const e = require('express');

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/restock/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.stock += amount || 50; // default restock amount = 50
    await product.save();

    res.json({ message: 'Product restocked', updatedProduct: product });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/sales/product-trends', async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const raw = await Sale.aggregate([
      {
        $match: { date: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            product: "$productId",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
          },
          totalSold: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id.product",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: "$productData" },
      {
        $project: {
          date: "$_id.date",
          product: "$productData.name",
          totalSold: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    const dailyMap = {};
    for (let entry of raw) {
      if (!dailyMap[entry.date]) dailyMap[entry.date] = { date: entry.date };
      dailyMap[entry.date][entry.product] = entry.totalSold;
    }

    res.json(Object.values(dailyMap));
  } catch (err) {
    console.error("Product trends error:", err);
    res.status(500).json({ error: 'Failed to fetch sales product trends' });
  }
});

router.get('/sales/summary', async (req, res) => {
  try {
    const sales = await Sale.find().populate('productId');
    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productSales = {};
    const categoryRevenue = {};

    for (let sale of sales) {
      const revenue = sale.quantity * sale.price;
      totalRevenue += revenue;
      totalItemsSold += sale.quantity;

      // Top Products
      const name = sale.productId.name;
      productSales[name] = (productSales[name] || 0) + sale.quantity;

      // Category Breakdown
      const category = sale.productId.category || 'Uncategorized';
     
      categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
    }
    
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, unitsSold]) => ({ name, unitsSold }));

    const categoryShare = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue
    }));

    const averageOrderValue = totalRevenue / (sales.length || 1);

    // Month-to-month comparison (simplified for now)
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthSales = sales.filter(sale => new Date(sale.date) >= startOfThisMonth);
    const lastMonthSales = sales.filter(sale =>
      new Date(sale.date) >= startOfLastMonth &&
      new Date(sale.date) < startOfThisMonth
    );

    const thisMonthRevenue = thisMonthSales.reduce((acc, s) => acc + s.quantity * s.price, 0);
    const lastMonthRevenue = lastMonthSales.reduce((acc, s) => acc + s.quantity * s.price, 0);
    const percentageGrowth = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 100;

    res.json({
      totalRevenue,
      totalItemsSold,
      averageOrderValue,
      topProducts,
      categoryShare,
      monthComparison: {
        thisMonthRevenue,
        lastMonthRevenue,
        percentageGrowth: parseFloat(percentageGrowth.toFixed(2))
      }
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Failed to load summary data' });
  }
});
module.exports = router;
