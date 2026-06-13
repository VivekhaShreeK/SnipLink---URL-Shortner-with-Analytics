const Visit = require('../models/Visit');
const Url = require('../models/Url');
const UAParser = require('ua-parser-js');
const { getLocation } = require('../utils/geoip');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Record a visit asynchronously (fire-and-forget).
 * Updates the URL click count and creates a Visit document.
 */
const recordVisit = async (urlDoc, req) => {
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Get client IP — support proxies
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const location = getLocation(ip);

    // Determine device type
    let deviceType = 'desktop';
    if (deviceInfo.type === 'mobile') deviceType = 'mobile';
    else if (deviceInfo.type === 'tablet') deviceType = 'tablet';
    else if (!deviceInfo.type) deviceType = 'desktop';

    // Create visit record
    await Visit.create({
      urlId: urlDoc.id,
      ip,
      userAgent: req.headers['user-agent'] || '',
      browser: browserInfo.name || 'Unknown',
      os: osInfo.name || 'Unknown',
      device: deviceType,
      country: location.country,
      city: location.city,
      referrer: req.headers.referer || req.headers.referrer || 'Direct',
    });

    // Increment click count and update last visited
    await urlDoc.increment('clicks', { by: 1 });
    await Url.update(
      { lastVisitedAt: new Date() },
      { where: { id: urlDoc.id } }
    );
  } catch (error) {
    // Log but don't throw — this is fire-and-forget
    console.error('Error recording visit:', error.message);
  }
};

/**
 * Get aggregated analytics for a URL.
 */
const getAnalytics = async (urlId) => {
  const [
    totalClicks,
    recentVisits,
    dailyClicks,
    deviceBreakdown,
    browserBreakdown,
    locationBreakdown,
    referrerBreakdown,
  ] = await Promise.all([
    // Total clicks
    Visit.count({ where: { urlId } }),

    // Recent 50 visits
    Visit.findAll({
      where: { urlId },
      order: [['timestamp', 'DESC']],
      limit: 50,
      raw: true,
    }),

    // Daily clicks for last 30 days
    Visit.findAll({
      attributes: [
        [sequelize.fn('TO_CHAR', sequelize.col('timestamp'), 'YYYY-MM-DD'), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        urlId,
        timestamp: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      group: [sequelize.fn('TO_CHAR', sequelize.col('timestamp'), 'YYYY-MM-DD')],
      order: [[sequelize.fn('TO_CHAR', sequelize.col('timestamp'), 'YYYY-MM-DD'), 'ASC']],
      raw: true
    }),

    // Device breakdown
    Visit.findAll({
      attributes: [
        'device',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { urlId },
      group: ['device'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true
    }),

    // Browser breakdown
    Visit.findAll({
      attributes: [
        'browser',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { urlId },
      group: ['browser'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      raw: true
    }),

    // Location breakdown
    Visit.findAll({
      attributes: [
        'country',
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { urlId },
      group: ['country', 'city'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 20,
      raw: true
    }),

    // Referrer breakdown
    Visit.findAll({
      attributes: [
        'referrer',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { urlId },
      group: ['referrer'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      raw: true
    }),
  ]);

  return {
    totalClicks,
    recentVisits: recentVisits.map(v => ({
      ...v,
      _id: v.id,
      url: v.urlId
    })),
    dailyClicks: dailyClicks.map((d) => ({ date: d.date, clicks: parseInt(d.count, 10) })),
    deviceBreakdown: deviceBreakdown.map((d) => ({ device: d.device, count: parseInt(d.count, 10) })),
    browserBreakdown: browserBreakdown.map((d) => ({ browser: d.browser, count: parseInt(d.count, 10) })),
    locationBreakdown: locationBreakdown.map((d) => ({
      country: d.country,
      city: d.city,
      count: parseInt(d.count, 10),
    })),
    referrerBreakdown: referrerBreakdown.map((d) => ({ referrer: d.referrer, count: parseInt(d.count, 10) })),
  };
};

module.exports = { recordVisit, getAnalytics };
