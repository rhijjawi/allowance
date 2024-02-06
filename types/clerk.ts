import { User } from '@clerk/clerk-sdk-node';

export type PublicMetadata<Role extends string> = {
  role: "student",
  currency: String,
  oversight: String[]
} | {
  role: "parent"
  reports: {
    email: String,
    currency: String,
    language: String
  },
  currency: String
}

interface UserPrivateMetadata extends User {
  publicMetadata:
}
interface ParentPrivateMetadata { }
interface StudentPrivateMetadata { }
interface UserPublicMetadata { }
