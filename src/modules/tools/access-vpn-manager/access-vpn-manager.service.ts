import { Injectable, Logger } from '@nestjs/common'
import OutlineVPN from 'outlinevpn-api'
import { User } from 'outlinevpn-api/dist/types'
import { IManagerAccessConfig } from './interface/manager-access.config.interface'
import { IKeyTransferredData } from './interface/key-transferred-data.interface'

@Injectable()
export class AccessVpnManagerService {
  private readonly logger = new Logger(AccessVpnManagerService.name)
  private readonly manager: OutlineVPN

  private static buildConnectionURL(credentials: IManagerAccessConfig): string {
    const { host, port, key } = credentials
    return `${host}:${port}/${key}`
  }

  private static createAccessLink(user: User): string {
    const { accessUrl } = user
    return `${process.env.INVITATION_SERVER_URL}#${accessUrl}`
  }

  constructor(private readonly credentials: IManagerAccessConfig) {
    const connectionUrl =
      AccessVpnManagerService.buildConnectionURL(credentials)
    this.manager = new OutlineVPN({
      apiUrl: connectionUrl,
      fingerprint: null // FIXME: apply new authorization
    })
  }

  public async createAccessKey(userEmail: string, code: string): Promise<User> {
    try {
      const newUser = await this.manager.createUser()
      const keyName = `${newUser.id}:${userEmail}:${code}` // 1:test@email.com:ABCDEFGH

      await this.manager.renameUser(newUser.id, keyName)
      await this.sendDataLimitForUser(newUser.id)

      return this.manager.getUser(newUser.id)
    } catch (error) {
      this.logger.error(`Cannot create user with email [${userEmail}]:`, error)
      throw error
    }
  }

  public async getKeyById(keyId: string): Promise<User> {
    try {
      const user = await this.manager.getUser(keyId)
      if (user) {
        return user
      } else {
        return null
      }
    } catch (error) {
      this.logger.error(`Cannot get key with id [${keyId}]:`, error)
      throw error
    }
  }

  public async deleteKey(keyId: string): Promise<void> {
    try {
      await this.manager.deleteUser(keyId)
    } catch (error) {
      this.logger.error(`Cannot delete key with id [${keyId}]:`, error)
      throw error
    }
  }

  public async getKeyTransferredData(keyId: string): Promise<number> {
    try {
      const { bytesTransferredByUserId } =
        (await this.manager.getDataUsage()) as IKeyTransferredData

      if (Object.keys(bytesTransferredByUserId).find((id) => id === keyId)) {
        return bytesTransferredByUserId[keyId]
      }
      return 0
    } catch (error) {
      this.logger.error(`Cannot get key data by id [${keyId}]:`, error)
      throw error
    }
  }

  private async findKey(userEmail: string, code: string): Promise<User> {
    try {
      const users = await this.manager.getUsers()
      return users.find((user) => user.name.includes(`${userEmail}:${code}`))
    } catch (error) {
      this.logger.error(`Cannot find key with email [${userEmail}]:`, error)
      throw error
    }
  }

  /**
   *
   * @param userId
   * @param limit by default is 40 GB
   * @private
   */
  private async sendDataLimitForUser(
    userId: string,
    limit: number = Number(process.env.MANAGER_API_DATA_LIMIT) || 40
  ): Promise<void> {
    const bytes = limit * 1000 ** 3
    if (bytes < Number.MAX_SAFE_INTEGER) {
      try {
        await this.manager.addDataLimit(userId, bytes)
      } catch (error) {}
    }
  }
}
