// src/lib/numeral-config.ts
import numeral from "numeral";

export function configureNumeral() {
  if (!numeral.locales.cl) {
    numeral.register("locale", "cl", {
      delimiters: {
        thousands: ".",
        decimal: ","
      },
      abbreviations: {
        thousand: "k",
        million: "m",
        billion: "b",
        trillion: "t"
      },
      currency: {
        symbol: "$"
      },
      ordinal: (_: number) => "" // Empty string as per your original config
    });
  }
  
  // Switch to the 'cl' locale after registering
  numeral.locale('cl');
}