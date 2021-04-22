import React from "react";
import { SlideFade } from "@chakra-ui/react";

export const PageSlideFade = ({ children }) => {
  return <SlideFade in>{children}</SlideFade>;
};
