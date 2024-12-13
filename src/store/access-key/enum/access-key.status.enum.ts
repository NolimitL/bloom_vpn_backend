export enum AccessKeyStatus {
  /**
   * Key in active mode and is able to operate.
   */
  ACTIVE = 'ACTIVE',

  /**
   * Key is not performed, e.g. stopped by user.
   */
  DISABLED = 'DISABLED',

  /**
   * Key is blocked because of any reasons, e.g. delay in payment.
   */
  BLOCKED = 'BLOCKED',

  /**
   * Occurs when key is deleted.
   */
  DELETED = 'DELETED',
}
