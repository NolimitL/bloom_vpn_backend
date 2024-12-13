import * as ms from 'ms'

export const TOKEN_AUTH_COOKIE_NAME = 'bloom-token'

/**
 * Credentials lifetime in seconds.
 */
export const TOKEN_AUTH_COOKIE_LIFETIME = ms('1d') / 1000

/**
 * Issuer of JWT token
 */
export const JWT_ISSUER = 'thebloom'
