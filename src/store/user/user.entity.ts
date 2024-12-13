import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../_base/_base.entity'
import { Exclude, plainToInstance } from 'class-transformer'
import { UserRegisterDto } from '../../modules/user/dto/user.register.dto'

@Entity('users')
export class User extends BaseEntity {
  static fromDto(userRegisterDto: UserRegisterDto): User {
    const user = plainToInstance(User, userRegisterDto)
    user.isVerified = false

    return user
  }

  @Column()
  public email: string

  @Column({ name: 'first_name' })
  public firstName: string

  @Column({ name: 'last_name' })
  public lastName: string

  @Column()
  @Exclude()
  public password: string

  /**
   * Date in DD/MM/YYYY format.
   */
  @Column()
  public birthdate: string

  @Column({ name: 'phone_number' })
  public phoneNumber: string

  @Column({ name: 'is_verified', default: false })
  public isVerified: boolean
}
