
export interface LoginSuccessfulPayload {
  token: string,
  user?: {
    id: string,
  }
}
