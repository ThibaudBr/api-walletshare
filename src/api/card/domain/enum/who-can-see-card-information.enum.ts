/**
 * @name WhoCanSeeCardInformationEnum
 * @description
 * Who can see card information
 * @enum
 * @readonly
 * @property {string} ALL - All users
 * @property {string} ONLY_CONNECTED_USERS - Only connected users
 * @property {string} ONLY_ME - Only me (PRIVATE)
 */
export enum WhoCanSeeCardInformationEnum {
  ALL = 'ALL',
  ONLY_CONNECTED_USERS = 'ONLY_CONNECTED_USERS',
  ONLY_ME = 'ONLY_ME',
}
