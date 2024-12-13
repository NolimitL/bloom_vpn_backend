import { Injectable, Logger } from '@nestjs/common'
import { IMailSenderConfig } from './interface/mail-sender.config.interface'
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from 'sib-api-v3-typescript'
import { IMailParams } from './interface/mail-params.interface'
import { MailTemplatesId } from './mail-templates-id.enum'

@Injectable()
export class MailSenderService {
  private readonly logger = new Logger(MailSenderService.name)
  private readonly sender: TransactionalEmailsApi
  private readonly senderCredentials: IMailSenderConfig

  constructor(private readonly credentials: IMailSenderConfig) {
    this.senderCredentials = credentials
    this.sender = new TransactionalEmailsApi()
    this.sender.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      this.senderCredentials.apiKey
    )
  }

  /**
   * Common email sending method
   * @param email
   * @param templateId
   * @param params
   */
  async sendToEmail(
    email: string,
    templateId: MailTemplatesId,
    params: IMailParams
  ): Promise<void> {
    try {
      await this.sender.sendTransacEmail({
        to: [
          {
            email: email,
          },
        ],
        sender: {
          name: this.senderCredentials.sender,
          email: this.senderCredentials.fromEmail,
        },
        templateId,
        params,
      })
    } catch (error) {
      this.logger.warn(`Cannot send the email to [${email}].`)
    }
  }
}
