import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { UserServiceStore } from '../../store/user/user.service'
import { UserRegisterDto } from './dto/user.register.dto'
import { User } from '../../store/user/user.entity'
import { HashService } from '../tools/hash.service'
import { UserUpdateDto } from './dto/user.update.dto'
import { ConfirmationService } from '../confirmation/confirmation.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly userStore: UserServiceStore,
    private readonly hashService: HashService,
    private readonly confirmationService: ConfirmationService
  ) {}

  async getUserData(userId: string): Promise<User> {
    try {
      return this.userStore.findById(userId)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to fetch user data.')
    }
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const hashPassword = await this.hashService.generateHash(
      userRegisterDto.password
    )

    const newUser = User.fromDto(userRegisterDto)
    newUser.password = hashPassword

    return this.userStore.save(newUser)
  }

  async updateUser(
    userId: string,
    userUpdateData: UserUpdateDto
  ): Promise<User> {
    try {
      const user = await this.userStore.findById(userId)
      if (userUpdateData.email && userUpdateData.email !== user.email) {
        user.isVerified = false
        await this.confirmationService.sendEmailConfirmation(
          user.id,
          user.email
        )
      }
      for (const [prop, value] of Object.entries(userUpdateData)) {
        user[prop] = value
      }
      return this.userStore.save(user)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to update user data.')
    }
  }

  async updateUserPasswordByOldPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<User> {
    const user = await this.userStore.findById(userId)
    const isPasswordValid = await this.hashService.verifyHash(
      oldPassword,
      user.password
    )
    if (!isPasswordValid) {
      throw new BadRequestException(
        'Current password is invalid. Please provide correct one.'
      )
    }

    return this.updateUserPassword(userId, newPassword)
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    try {
      const user = await this.userStore.findById(userId)
      user.password = await this.hashService.generateHash(newPassword)

      return this.userStore.save(user)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unable to update user password.')
    }
  }

  async updateUserConfirmation(
    userId: string,
    isVerified: boolean
  ): Promise<User> {
    try {
      const user = await this.userStore.findById(userId)

      user.isVerified = isVerified
      return this.userStore.save(user)
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }
}
