const geoip = require('geoip-lite');

/**
 * Look up geographic location from an IP address.
 * @param {string} ip - The IP address
 * @returns {{ country: string, city: string }}
 */
const getLocation = (ip) => {
  // Handle localhost / private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'Local', city: 'Local' };
  }

  const geo = geoip.lookup(ip);
  if (!geo) {
    return { country: 'Unknown', city: 'Unknown' };
  }

  return {
    country: geo.country || 'Unknown',
    city: geo.city || 'Unknown',
  };
};

module.exports = { getLocation };
