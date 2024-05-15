export interface User {
  userId: string;
  userName: string;
  email: string;
  emailId: string;
  emailDomain: string;
  password: string;
  role?: string; // role은 선택적 필드입니다.
}
