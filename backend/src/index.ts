import express from "express";
import cors from "cors";
import { CreditCard } from "../../api/types";
import { validateCreditCard } from "./validate-credit-card";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/credit-cards/validate", async (req, res) => {
  const card = req.body as CreditCard;
  const validationResponse = validateCreditCard(card);
  res.json(validationResponse);
});

app.listen(8000, () => {
  console.log(`Server is running on http://localhost:${8000}`);
});
