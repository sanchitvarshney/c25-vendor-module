export const getCurrentFinancialYearSession = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const financialYearStart = now.getMonth() >= 3 ? currentYear : currentYear - 1;

  const startYearShort = String(financialYearStart).slice(-2);
  const endYearShort = String(financialYearStart + 1).slice(-2);

  return `${startYearShort}-${endYearShort}`;
};

export const getFinancialYearSessionOptions = (startFinancialYear = 2022) => {
  const currentSession = getCurrentFinancialYearSession();
  const currentStartYear = Number(`20${currentSession.split("-")[0]}`);
  const options = [];

  for (let year = startFinancialYear; year <= currentStartYear; year += 1) {
    const startYearShort = String(year).slice(-2);
    const endYearShort = String(year + 1).slice(-2);
    const value = `${startYearShort}-${endYearShort}`;

    options.push({
      label: `Session ${value}`,
      value,
    });
  }

  return options;
};
