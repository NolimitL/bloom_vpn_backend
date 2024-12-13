/**
 * Id of available mail templates
 */
export enum MailTemplatesId {
  // beta-version
  INVITATION = 1,
  INVITATION_REPEATER = 2,
  // version 1.0.0
  RESET_PASSWORD = 4,
  EMAIL_CONFIRMATION = 5,
  WELCOME_EMAIL = 6,

  // Not done yet
  USER_DATA_UPDATE,
  PASSWORD_UPDATE,
}
