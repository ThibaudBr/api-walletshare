/**
 * @Name WhoCanShareCardEnum
 * Who can share card
 * @enum {string}
 * @property {string} DIFFUSIBLE - The card is diffusable.
 * @property {string} NOT_DIFFUSIBLE - The card is not diffusable.
 * @property {string} ONlY_BY_COMPANY_MEMBERS - The card is diffusable only by company members.
 * @property {string} ONLY_BY_COMPANY_ADMIN - The card is diffusable only by company admin.
 */
export enum WhoCanShareCardEnum {
  DIFFUSIBLE = 'DIFFUSIBLE',
  NOT_DIFFUSIBLE = 'NOT_DIFFUSIBLE',
  ONlY_BY_COMPANY_MEMBERS = 'ONlY_BY_COMPANY_MEMBERS',
  ONLY_BY_COMPANY_ADMIN = 'ONLY_BY_COMPANY_ADMIN',
}
