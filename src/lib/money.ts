// All money is integer paise. Never float.
export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function rupees(paise: number): number {
  return Math.round(paise / 100);
}

export function fromRupees(rupees: number): number {
  return Math.round(rupees * 100);
}
