export interface User {
  userId: string;
  userName: string;
  useremailId: string;
  useremailDomain: string;
  userPassword: string;
  userRole?: string; // role은 선택적 필드입니다.
}
