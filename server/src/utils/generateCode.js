const { customAlphabet } = require('nanoid');
const { Op } = require('sequelize');

// Base62 alphabet for URL-safe short codes
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 7);

/**
 * Generate a unique short code, checking against existing codes in the database.
 * @param {Model} UrlModel - Sequelize Url model for uniqueness check
 * @returns {string} A unique 7-character short code
 */
const generateShortCode = async (UrlModel) => {
  let code = nanoid();
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const existing = await UrlModel.findOne({
      where: {
        [Op.or]: [{ shortCode: code }, { customAlias: code }],
      },
    });
    if (!existing) return code;
    code = nanoid();
    attempts++;
  }

  throw new Error('Failed to generate a unique short code. Please try again.');
};

module.exports = { generateShortCode };
