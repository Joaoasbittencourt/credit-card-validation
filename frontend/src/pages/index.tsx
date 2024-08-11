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
  FormErrorMessage,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { validateCreditCard } from "../requests/validate-credit-card";
import { CreditCardValidationResponse } from "../../../api/types";

export default function Home() {
  const [cardNumber, setCardNumber] = useState("");
  const [validation, setValidation] =
    useState<CreditCardValidationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);
      setLoading(true);
      const res = await validateCreditCard(cardNumber);
      setValidation(res);
    } catch (error) {
      setError((error as any).message);
    } finally {
      setLoading(false);
    }
  };

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
              <FormControl isInvalid={!!validation && !validation.valid}>
                <FormLabel>Card number</FormLabel>
                <Input
                  value={cardNumber}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="1234567812345678"
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <FormErrorMessage>Invalid Credit Card Number</FormErrorMessage>
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
