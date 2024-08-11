import { FormErrorMessage } from "@chakra-ui/react";

export const MultiFormErrorMessage = ({
  errors,
  name,
}: {
  errors: string[];
  name: string;
}) => {
  return (
    <>
      {errors.map((error, i) => (
        <FormErrorMessage key={`FormErrorMessage:error:${name}:${i}`}>
          {error}
        </FormErrorMessage>
      ))}
    </>
  );
};
