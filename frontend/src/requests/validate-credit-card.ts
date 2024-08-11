import { CreditCard, CreditCardValidationResponse } from "../../../api/types";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const validateCreditCard = async (
  creditCard: CreditCard
): Promise<CreditCardValidationResponse> => {
  const response = await fetch(`${url}/credit-cards/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creditCard),
  });

  const data = await response.json();
  return data;
};
