export interface PaymentData {
  pg: string;
  pay_method: string;
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_name: string;
  buyer_tel: string;
  buyer_email: string;
  buyer_addr: string;
  buyer_postcode: string;
}

export interface PaymentResponse {
  success: boolean;
  imp_uid?: string;
  merchant_uid?: string;
  error_msg?: string;
}
