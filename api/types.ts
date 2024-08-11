export type CreditCard = {
  cardNumber: string;
  holderName: string;
};

export type CreditCardField = keyof CreditCard;

export type CreditCardErrorRecord = Partial<
  Record<CreditCardField, string[] | undefined>
>;

export type CreditCardValidationResponse =
  | {
      valid: true;
    }
  | {
      valid: false;
      errors: CreditCardErrorRecord;
    };
