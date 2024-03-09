import { UserProfile } from '@auth0/nextjs-auth0/client'

export default interface Metadata extends UserProfile {
    user_metadata?: { currency: string | undefined }
}
