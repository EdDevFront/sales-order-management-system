import { formatCurrencyBR } from "./formatCurrency";

describe("Currency Formatting (BRL)", () => {
  test("should format integer as BRL currency", () => {
    expect(formatCurrencyBR(1500)).toBe("R$\u00a01.500,00");
  });

  test("should format decimal as BRL currency", () => {
    expect(formatCurrencyBR(1234.56)).toBe("R$\u00a01.234,56");
  });

  test("should format zero", () => {
    expect(formatCurrencyBR(0)).toBe("R$\u00a00,00");
  });

  test("should format large numbers with grouping", () => {
    expect(formatCurrencyBR(1000000)).toBe("R$\u00a01.000.000,00");
  });

  test("should format small decimal", () => {
    expect(formatCurrencyBR(0.01)).toBe("R$\u00a00,01");
  });

  test("should format thousands correctly", () => {
    expect(formatCurrencyBR(3450)).toBe("R$\u00a03.450,00");
  });
});
