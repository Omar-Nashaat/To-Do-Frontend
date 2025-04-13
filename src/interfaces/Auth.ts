export interface IUserPayload {
  id: string;
  email: string;
  name: string;
  rememberMe: boolean;
}

export interface IJwtCustomPayload {
  user: IUserPayload;
  iat: number;
  exp: number;
}
