import { useState } from "react";
import {
  Input,
  Button,
  VStack,
  Heading,
  Container,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { validateCreditCard } from "../requests/validate-credit-card";
import {
  CreditCardField,
  CreditCardValidationResponse,
} from "../../../api/types";
import { MultiFormErrorMessage } from "../components/multi-form-error-message";

const getFieldErrors = (
  validation: CreditCardValidationResponse | null,
  field: CreditCardField
) => {
  return validation?.valid ? [] : validation?.errors[field] || [];
};

export default function Home() {
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [validation, setValidation] =
    useState<CreditCardValidationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);
      setLoading(true);
      const res = await validateCreditCard({ cardNumber, holderName });
      setValidation(res);
    } catch (error) {
      setError((error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const cardNumberErrors = getFieldErrors(validation, "cardNumber");
  const holderNameErrors = getFieldErrors(validation, "holderName");

  return (
    <Container textAlign="center" py={10} px={6}>
      <VStack align={"flex-start"} spacing={4}>
        <Heading mb={4} size="lg">
          Credit card
        </Heading>
        <Card variant={"outline"} width={"100%"}>
          <CardBody width={"100%"}>
            <VStack
              as="form"
              align={"flex-start"}
              width={"100%"}
              onSubmit={(e: any) =>
                handleSubmit(e as React.FormEvent<HTMLFormElement>)
              }
            >
              <FormControl isInvalid={cardNumberErrors.length > 0}>
                <FormLabel>Card number</FormLabel>
                <Input
                  value={cardNumber}
                  type="text"
                  placeholder="1234567812345678"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <MultiFormErrorMessage
                  name="cardNumber"
                  errors={cardNumberErrors}
                />
              </FormControl>
              <FormControl isInvalid={holderNameErrors.length > 0}>
                <FormLabel>Holder Name</FormLabel>
                <Input
                  value={holderName}
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setHolderName(e.target.value)}
                />
                <MultiFormErrorMessage
                  name="holderName"
                  errors={holderNameErrors}
                />
              </FormControl>
              <Button isLoading={loading} type={"submit"}>
                Validate
              </Button>
            </VStack>
          </CardBody>
        </Card>
        {!!validation && validation.valid && (
          <Alert rounded={"md"} status="success">
            <AlertIcon />
            Your Credit Card is valid.
          </Alert>
        )}
        {!!validation && !validation.valid && (
          <Alert rounded={"md"} status="error">
            <AlertIcon />
            Your Credit Card is invalid.
          </Alert>
        )}
        {error && (
          <Alert rounded={"md"} status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </VStack>
    </Container>
  );
}
