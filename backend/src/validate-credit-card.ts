import {
  CreditCard,
  CreditCardErrorRecord,
  CreditCardField,
  CreditCardValidationResponse,
} from "./types";
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

  if (!card.expiration) {
    errors = addError(errors, "expiration", "Expiration is required");
  } else {
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(card.expiration)) {
      errors = addError(
        errors,
        "expiration",
        "Invalid format. Please use MM/YYYY."
      );
    }

    const [month, year] = card.expiration.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors = addError(errors, "expiration", "The card has already expired.");
    }

    const expDate = new Date(year, month);
    const futureLimit = new Date(currentYear + 20, currentMonth);
    if (expDate > futureLimit) {
      errors = addError(
        errors,
        "expiration",
        "The date is too far in the future."
      );
    }
  }

  if (!card.securityCode) {
    errors = addError(errors, "securityCode", "Security code is required");
  } else {
    if (card.securityCode.length !== 3) {
      errors = addError(
        errors,
        "securityCode",
        "Security code must be 3 digits long"
      );
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors ? { valid: false, errors } : { valid: true };
};
