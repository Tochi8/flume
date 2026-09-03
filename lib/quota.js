export function monthKey(date = new Date(), timeZone = "Africa/Lagos") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  return `${year}${month}`;
}

export function canExtract(tenant) {
  return tenant.extractsUsed < tenant.extractLimit;
}
