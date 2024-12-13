import { User } from 'outlinevpn-api/dist/types'

export class AccessKeyDataDto implements User {
  accessUrl: string
  id: string
  method: string
  name: string
  password: string
  port: number
  dataLimit: {
    bytes: number
  }
}
