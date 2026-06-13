const { Op } = require('sequelize');
const Url = require('../models/Url');
const { generateShortCode } = require('../utils/generateCode');
const { isValidUrl, isValidAlias, isReservedPath } = require('../utils/validators');
const { recordVisit } = require('../services/analyticsService');
const { BASE_URL } = require('../config/env');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * POST /api/urls — Create a new short URL
 */
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid HTTP/HTTPS URL.',
      });
    }

    // Validate custom alias if provided
    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Alias must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores.',
        });
      }

      if (isReservedPath(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'This alias is reserved and cannot be used.',
        });
      }

      // Check if alias is already taken
      const existingAlias = await Url.findOne({
        where: {
          [Op.or]: [{ shortCode: customAlias }, { customAlias }],
        },
      });
      if (existingAlias) {
        return res.status(409).json({
          success: false,
          message: 'This alias is already taken. Please choose another.',
        });
      }
    }

    // Validate expiration date
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiration date must be in the future.',
      });
    }

    const shortCode = await generateShortCode(Url);

    const url = await Url.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      userId: req.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully.',
      data: {
        url: {
          ...url.toJSON(),
          shortUrl: `${BASE_URL}/${url.effectiveCode}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/urls — List user's URLs with search, sort, and pagination
 */
const getUrls = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const whereClause = { userId: req.user.id };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { originalUrl: { [Op.iLike]: `%${search}%` } },
        { shortCode: { [Op.iLike]: `%${search}%` } },
        { customAlias: { [Op.iLike]: `%${search}%` } },
      ];
    }

    let order = [['createdAt', 'DESC']];
    const allowedSorts = ['createdAt', 'clicks', 'lastVisitedAt'];
    if (allowedSorts.includes(sortBy)) {
      order = [[sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];
    }

    const limitInt = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * limitInt;

    const { rows: urls, count: total } = await Url.findAndCountAll({
      where: whereClause,
      order,
      limit: limitInt,
      offset,
    });

    // Add short URL to each record
    const urlsWithShortUrl = urls.map((u) => {
      const uJson = u.toJSON();
      return {
        ...uJson,
        effectiveCode: uJson.customAlias || uJson.shortCode,
        shortUrl: `${BASE_URL}/${uJson.customAlias || uJson.shortCode}`,
      };
    });

    res.json({
      success: true,
      data: {
        urls: urlsWithShortUrl,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: limitInt,
          pages: Math.ceil(total / limitInt),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/urls/:id — Edit a URL
 */
const updateUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { originalUrl, customAlias, expiresAt, isActive } = req.body;

    const url = await Url.findOne({ where: { id, userId: req.user.id } });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found.',
      });
    }

    // Validate and update original URL
    if (originalUrl !== undefined) {
      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid HTTP/HTTPS URL.',
        });
      }
      url.originalUrl = originalUrl;
    }

    // Validate and update custom alias
    if (customAlias !== undefined) {
      if (customAlias === '' || customAlias === null) {
        url.customAlias = null;
      } else {
        if (!isValidAlias(customAlias)) {
          return res.status(400).json({
            success: false,
            message: 'Alias must be 3-30 characters and contain only letters, numbers, hyphens, underscores.',
          });
        }
        if (isReservedPath(customAlias)) {
          return res.status(400).json({
            success: false,
            message: 'This alias is reserved.',
          });
        }
        // Check uniqueness (exclude current URL)
        const existing = await Url.findOne({
          where: {
            id: { [Op.ne]: id },
            [Op.or]: [{ shortCode: customAlias }, { customAlias }],
          },
        });
        if (existing) {
          return res.status(409).json({
            success: false,
            message: 'This alias is already taken.',
          });
        }
        url.customAlias = customAlias;
      }
    }

    if (expiresAt !== undefined) {
      url.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    if (isActive !== undefined) {
      url.isActive = isActive;
    }

    await url.save();

    res.json({
      success: true,
      message: 'URL updated successfully.',
      data: {
        url: {
          ...url.toJSON(),
          shortUrl: `${BASE_URL}/${url.effectiveCode}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/urls/:id — Delete a URL
 */
const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const url = await Url.findOne({ where: { id, userId: req.user.id } });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found.',
      });
    }

    // Also delete associated visits
    const Visit = require('../models/Visit');
    await Visit.destroy({ where: { urlId: url.id } });

    await url.destroy();

    res.json({
      success: true,
      message: 'URL deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/urls/bulk — CSV bulk upload
 */
const bulkUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file.',
      });
    }

    const results = [];
    const errors = [];
    let lineNum = 0;

    const stream = Readable.from(req.file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          lineNum++;
          const url = row.url || row.URL || row.originalUrl || row.original_url || '';
          const alias = row.alias || row.customAlias || row.custom_alias || '';
          if (url.trim()) {
            results.push({ originalUrl: url.trim(), customAlias: alias.trim() || undefined, line: lineNum });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const created = [];
    for (const item of results) {
      try {
        if (!isValidUrl(item.originalUrl)) {
          errors.push({ line: item.line, url: item.originalUrl, error: 'Invalid URL' });
          continue;
        }

        if (item.customAlias) {
          if (!isValidAlias(item.customAlias) || isReservedPath(item.customAlias)) {
            errors.push({ line: item.line, url: item.originalUrl, error: 'Invalid alias' });
            continue;
          }
          const existing = await Url.findOne({
            where: {
              [Op.or]: [{ shortCode: item.customAlias }, { customAlias: item.customAlias }],
            },
          });
          if (existing) {
            errors.push({ line: item.line, url: item.originalUrl, error: 'Alias already taken' });
            continue;
          }
        }

        const shortCode = await generateShortCode(Url);
        const newUrl = await Url.create({
          originalUrl: item.originalUrl,
          shortCode,
          customAlias: item.customAlias || null,
          userId: req.user.id,
        });
        created.push({
          originalUrl: newUrl.originalUrl,
          shortUrl: `${BASE_URL}/${newUrl.effectiveCode}`,
        });
      } catch (err) {
        errors.push({ line: item.line, url: item.originalUrl, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Processed ${results.length} URLs. Created: ${created.length}, Errors: ${errors.length}`,
      data: { created, errors },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /:code — Redirect short URL to original
 */
const redirectUrl = async (req, res, next) => {
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
        message: 'Short URL not found.',
      });
    }

    // Check expiration
    if (url.isExpired()) {
      return res.status(410).json({
        success: false,
        message: 'This short URL has expired.',
      });
    }

    // Record visit asynchronously (fire-and-forget)
    recordVisit(url, req);

    // Redirect
    res.redirect(301, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUrl,
  getUrls,
  updateUrl,
  deleteUrl,
  bulkUpload,
  redirectUrl,
};
