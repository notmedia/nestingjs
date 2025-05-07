import { Interceptor, sql } from 'slonik';

/**
 * Creates an interceptor that sets the time zone for each DB session.
 *
 * @param {string} [timezone] - A valid IANA time zone name recognized by PostgreSQL.
 * Example values: 'UTC', 'America/New_York', 'Asia/Dubai'.
 * @returns {Interceptor} An interceptor that sets the session time zone.
 */
export function createTimezoneInterceptor(timezone = 'UTC'): Interceptor {
  return {
    name: 'nestingjs-slonik-timezone-interceptor',
    afterPoolConnection: async (_, connection) => {
      await connection.query(sql.unsafe`SET TIME ZONE ${sql.literalValue(timezone)}`);

      return null;
    },
  };
}
