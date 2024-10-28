export function numberToWords(num: number): string {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  if (num === 0) return 'zero';

  let words = '';

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += numberToWords(thousands) + ' thousand ';
    num %= 1000;
  }

  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    words += ones[hundreds] + ' hundred ';
    num %= 100;
  }

  if (num >= 20) {
    const tensPlace = Math.floor(num / 10);
    words += tens[tensPlace] + ' ';
    num %= 10;
  }

  if (num > 0) {
    words += ones[num] + ' ';
  }

  return words.trim();
}
