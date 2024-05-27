export interface Login {
  userId: string;
  userPassword: string;
  userRole?: string;
}

export interface ServerError {
  error: {
    message: string;
  };
}
