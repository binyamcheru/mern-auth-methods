const crypto = require('crypto');

/**
 * Base64Url encoding (standard Base64 with + replaced by -, / replaced by _, and padding = removed)
 */
const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

/**
 * Base64Url decoding
 */
const base64UrlDecode = (str) => {
  // Add back padding if necessary
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString();
};

/**
 * Sign a token
 * @param {Object} payload 
 * @param {String} secret 
 * @param {Object} options - expiresIn (in seconds or string with unit e.g. '1h')
 */
const sign = (payload, secret, options = {}) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const iat = Math.floor(Date.now() / 1000);
  let exp;

  if (options.expiresIn) {
    if (typeof options.expiresIn === 'number') {
      exp = iat + options.expiresIn;
    } else if (typeof options.expiresIn === 'string') {
      const unit = options.expiresIn.slice(-1);
      const val = parseInt(options.expiresIn.slice(0, -1));
      switch (unit) {
        case 's': exp = iat + val; break;
        case 'm': exp = iat + val * 60; break;
        case 'h': exp = iat + val * 3600; break;
        case 'd': exp = iat + val * 86400; break;
        default: exp = iat + val;
      }
    }
  }

  const completePayload = {
    ...payload,
    iat,
    ...(exp && { exp })
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(completePayload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Verify a token
 * @param {String} token 
 * @param {String} secret 
 * @returns {Object} decoded payload
 * @throws Error if invalid or expired
 */
const verify = (token, secret) => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Invalid token format');
  }

  // Re-calculate signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  // Check expiration
  if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
};

module.exports = {
  sign,
  verify,
  base64UrlEncode,
  base64UrlDecode
};
