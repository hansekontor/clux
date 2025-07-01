import React, { useState } from "react";

// core functions
import { useCashout } from "blocklotto-sdk";

import { Flex } from "@components/Common";
import { Input, Select, SelectOption } from "@components/Form";

export default function Filter() {
  const {
    cashoutMethod,
    maxCashoutAmount,
    tilloCountryOptions,
    tilloCurrencyOptions,
    giftcardAmount,
    setGiftcardAmount,
    filterTilloBrands,
    tilloStage,
    setTilloStage,
  } = useCashout();

  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");

  const min = 10;

  const handleSubmitFilters = async (e) => {
    e.preventDefault();

    if (cashoutMethod === "tillo") {
      const country = e.target.country.value;
      const currency = e.target.currency.value;

      const filteredBrands = filterTilloBrands(country, currency);
      if (filteredBrands.length > 0) {
        setTilloStage("brand");
      }
    }
  };

  return (
    <Flex
      as="form"
      id={`${tilloStage}-form`}
      onSubmit={handleSubmitFilters}
      direction="column"
      gap={2}
      paddingBottom={2}
      backgroundColor="white"
      padding={2}
      borderRadius="sm"
      boxShadow={2}
    >
      <Flex direction="column" gap={2}>
        <Input
          type="number"
          id="Amount"
          name="amount"
          placeholder="0"
          label="Amount"
          fullWidth
          value={giftcardAmount}
          onChange={(e) => setGiftcardAmount(e.target.value)}
          required
        />

        <Select
          label="Currency"
          name="currency"
          required
          searchable
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
          min={min}
          step={10}
          max={maxCashoutAmount}
        >
          {tilloCurrencyOptions.map((option) => (
            <SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>
          ))}
        </Select>

        <Select
          label="Country"
          name="country"
          required
          searchable
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        >
          {tilloCountryOptions.map((option) => (
            <SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
}
