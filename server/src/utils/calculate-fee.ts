import { numberToWords } from './number-to-words';

interface CalculateFeesParams {
  registrationFee: string;
  examinationFee: string;
  admissionFee: string;
  securityDeposite: string;
  otherCharges: string;
  tax: string;
  extraCharges?: string;
  discount?: string;
}

export function calculateFees(params: CalculateFeesParams) {
  const {
    registrationFee,
    examinationFee,
    admissionFee,
    securityDeposite,
    otherCharges,
    tax,
    extraCharges = '0',
    discount = '0',
  } = params;

  // Calculate the total annual fee by summing all the fees
  const anualFee =
    parseFloat(registrationFee) +
    parseFloat(examinationFee) +
    parseFloat(admissionFee) +
    parseFloat(securityDeposite) +
    parseFloat(otherCharges);

  // Calculate the monthly fee by dividing the annual fee by 12
  const monthlyFee = anualFee / 12;

  // Handle tax
  let taxPercentage = tax || '0';
  if (taxPercentage.includes('%')) {
    taxPercentage = taxPercentage.replace('%', '');
  }
  const taxValue = parseFloat(taxPercentage) || 0;

  const extraChargesValue = parseFloat(extraCharges) || 0;

  // Calculate the tax amount
  const taxAmount = (monthlyFee * taxValue) / 100;

  // Calculate the discount
  let discountValue = parseFloat(discount) || 0;
  if (discount.includes('%')) {
    discountValue = (monthlyFee * parseFloat(discount.replace('%', ''))) / 100;
  }

  // Calculate the total (monthly fee + tax + extra charges - discount)
  const total = monthlyFee + taxAmount + extraChargesValue - discountValue;

  // Convert the total to words
  const totalInWords = numberToWords(Math.round(total));

  return {
    anualFee: anualFee.toString(),
    monthlyFee: monthlyFee.toString(),
    total: total.toString(),
    totalInWords,
  };
}
