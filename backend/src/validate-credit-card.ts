import {
  CreditCard,
  CreditCardErrorRecord,
  CreditCardField,
  CreditCardValidationResponse,
} from "../../api/types";
import { luhnCheck } from "./luhn-check";

const addError = (
  errors: CreditCardErrorRecord,
  field: CreditCardField,
  error: string
) => {
  if (!errors[field]) {
    errors[field] = [];
  }
  errors[field]?.push(error);
  return errors;
};

export const validateCreditCard = (
  card: CreditCard
): CreditCardValidationResponse => {
  let errors: CreditCardErrorRecord = {};

  if (!luhnCheck(card.cardNumber)) {
    errors = addError(errors, "cardNumber", "Invalid card number");
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors ? { valid: false, errors } : { valid: true };
};
