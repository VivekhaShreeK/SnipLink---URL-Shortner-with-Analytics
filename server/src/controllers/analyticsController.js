const { Op } = require('sequelize');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { getAnalytics } = require('../services/analyticsService');
const { Parser } = require('json2csv');

/**
 * GET /api/analytics/:urlId — Get full analytics for a URL
 */
const getUrlAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;

    // Verify ownership
    const url = await Url.findOne({ where: { id: urlId, userId: req.user.id } });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found.',
      });
    }

    const analytics = await getAnalytics(url.id);

    res.json({
      success: true,
      data: {
        url: url.toJSON(),
        analytics,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/:urlId/export — Export analytics as CSV
 */
const exportAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;

    // Verify ownership
    const url = await Url.findOne({ where: { id: urlId, userId: req.user.id } });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found.',
      });
    }

    const visits = await Visit.findAll({
      where: { urlId: url.id },
      order: [['timestamp', 'DESC']],
      raw: true,
    });

    if (visits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No analytics data to export.',
      });
    }

    const fields = ['timestamp', 'browser', 'os', 'device', 'country', 'city', 'referrer'];
    const parser = new Parser({ fields });
    const csvData = parser.parse(visits);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analytics_${url.shortCode}_${Date.now()}.csv`
    );
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/public/:code — Public stats for a URL (no auth required)
 */
const getPublicStats = async (req, res, next) => {
  try {
    const { code } = req.params;

    const url = await Url.findOne({
      where: {
        [Op.or]: [{ shortCode: code }, { customAlias: code }],
        isActive: true,
      },
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found.',
      });
    }

    // Return limited public information
    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.effectiveCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastVisitedAt: url.lastVisitedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUrlAnalytics, exportAnalytics, getPublicStats };
