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


  if (!card.cardNumber) {
    errors = addError(errors, "cardNumber", "Card number is required");
  } else {
    if (!luhnCheck(card.cardNumber)) {
      errors = addError(errors, "cardNumber", "Invalid card number");
    }
  }

  if (!card.holderName) {
    errors = addError(errors, "holderName", "Holder name is required");
  } else {
    if (card.holderName?.length < 3) {
      errors = addError(errors, "holderName", "Holder name is too short");
    }

    if (card.holderName?.length > 50) {
      errors = addError(errors, "holderName", "Holder name is too long");
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors ? { valid: false, errors } : { valid: true };
};
