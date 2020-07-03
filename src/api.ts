/**
 * Common Route Prefix
 * @param apiVersion api version
 * @param urlPrefix url prefix
 */
export const apiPath = (apiVersion: number, urlPrefix: string): string => {
  return `/api/v${apiVersion}/${urlPrefix}`;
};