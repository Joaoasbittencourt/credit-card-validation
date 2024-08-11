import {
  CreditCard,
  CreditCardErrorRecord,
  CreditCardValidationResponse,
} from "./types";
import { luhnCheck } from "./luhn-check";

export const validateCreditCard = (
  card: CreditCard
): CreditCardValidationResponse => {
  const validations: CreditCardErrorRecord = {
    cardNumber: validateCardNumber(card.cardNumber),
    holderName: validateHolderName(card.holderName),
    expiration: validateExpiration(card.expiration),
    securityCode: validateSecurityCode(card.securityCode),
  };

  const errors = Object.fromEntries(
    Object.entries(validations).filter(([, errors]) => errors.length > 0)
  );

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors ? { valid: false, errors } : { valid: true };
};

const validateCardNumber = (cardNumber: string) => {
  if (!cardNumber) {
    return ["Card number is required"];
  }

  if (!luhnCheck(cardNumber)) {
    return ["Invalid card number"];
  }
  return [];
};

const validateHolderName = (holderName: string) => {
  if (!holderName) {
    return ["Holder name is required"];
  }

  if (holderName.length < 3) {
    return ["Holder name is too short"];
  }

  if (holderName.length > 50) {
    return ["Holder name is too long"];
  }
  return [];
};

const validateExpiration = (expiration: string) => {
  if (!expiration) {
    return ["Expiration is required"];
  }

  const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  if (!regex.test(expiration)) {
    return ["Invalid format. Please use MM/YYYY."];
  }

  const [month, year] = expiration.split("/").map(Number);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return ["The card has already expired."];
  }

  const expDate = new Date(year, month);
  const futureLimit = new Date(currentYear + 20, currentMonth);
  if (expDate > futureLimit) {
    return ["The date is too far in the future."];
  }

  return [];
};

const validateSecurityCode = (securityCode: string) => {
  if (!securityCode) {
    return ["Security code is required"];
  }

  if (securityCode.length !== 3) {
    return ["Security code must be 3 digits long"];
  }
  return [];
};
