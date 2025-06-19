import React from "react";

// core functions
import { useCashout, useNotifications } from "blocklotto-sdk";

import { Flex } from "@components/Common";
import { Select, SelectOption } from "@components/Form";

export default function Brand() {
  const {
    tilloStage,
    setTilloStage,
    tilloSelection,
    brandData,
    handleTilloBrandChange,
    getGiftcardLink,
  } = useCashout();

  const notify = useNotifications();

  // handlers
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    const brand = e.target.brand.value;
    const link = await getGiftcardLink(brand, handleGiftcardError);

    if (link) {
      setTilloStage("giftcard");
    }
  };

  const handleGiftcardError = () => {
    notify({ type: "error", message: "Giftcard API Error" });
  };

  return (
    <Flex
      as={"form"}
      direction="column"
      id={`${tilloStage}-form`}
      onSubmit={handleBrandSubmit}
      gap={2}
    >

      <Select
        label="Brand"
        name="brand"
        required
        searchable
        onChange={(e) => handleTilloBrandChange(e.target.value)}
        value={brandData.value || ""}
      >
        {tilloSelection.map((option) => (
          <SelectOption key={option.value} value={option.value}>
            {option.label}
          </SelectOption>
        ))}
      </Select>

      {brandData && (
        <>
          <img src={brandData.logo} />
          <p>{brandData.description}</p>
        </>
      )}
    </Flex>
  );
}
