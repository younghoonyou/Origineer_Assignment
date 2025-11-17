export const roundCash = (value: number): number => {
  const cents = Math.round(value * 100);
  const lastDigit = cents % 10;

  let adjustment = 0;

  if (lastDigit === 1 || lastDigit === 2) adjustment = -lastDigit;
  else if (lastDigit === 3 || lastDigit === 4) adjustment = 5 - lastDigit;
  else if (lastDigit === 6 || lastDigit === 7) adjustment = 5 - lastDigit;
  else if (lastDigit === 8 || lastDigit === 9) adjustment = 10 - lastDigit;

  const roundedCents = cents + adjustment;

  return roundedCents / 100;
};
