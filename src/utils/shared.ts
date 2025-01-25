import { addDays, format, parse } from 'date-fns';
// import * as crypto from 'node:crypto';

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export const isValidDate = (dateString: any) => {
  const [day, month, year] = dateString.split('.').map(Number);
  const inputDate = new Date(year, month - 1, day); // Month is 0-based
  if (
    inputDate.getFullYear() !== year ||
    inputDate.getMonth() + 1 !== month ||
    inputDate.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

export function formatDateRange(
  startDate: any,
  durationDays: any,
  otherDate: any,
  isDateValid: any,
  language: any
) {
  if (startDate === 'otherday') {
    if (otherDate.replace('_', '').length === 10 && isDateValid) {
      const parsedDate = parse(otherDate, 'dd.MM.yyyy', new Date());
      const end = addDays(parsedDate, durationDays - 1);
      const formatDate = (date: any) => format(date, 'dd.MM.yyyy');

      const startFormatted = formatDate(parsedDate);
      const endFormatted = formatDate(end);

      return `${startFormatted} - ${endFormatted} (${durationDays} ${
        language === 'ru' ? 'дней' : 'zile'
      })`;
    } else return '';
  }
  const parsedDate = parse(startDate, 'yyyy-MM-dd', new Date());
  const end = addDays(parsedDate, durationDays - 1);
  const formatDate = (date: any) => format(date, 'dd.MM.yyyy');

  const startFormatted = formatDate(parsedDate);
  const endFormatted = formatDate(end);

  return `${startFormatted} - ${endFormatted} (${durationDays}  ${
    language === 'ru' ? 'дней' : 'zile'
  })`;
}

// interface Data {
//   // ... other fields from the query string
//   hash: string;
//   auth_date: number;
// }

// async function validateData(data: Data): Promise<boolean> {
//   const botToken = '7979153339:AAEsRGugNb12M8V-NLWJeMre5uYsyf-FB3E'; // Replace with your token fetching logic

//   // 1. Construct the data-check-string
//   const sortedKeys = Object.keys(data).sort();
//   const dataCheckString = sortedKeys
//     .map((key) => `${key}=${data[key]}`)
//     .join('\n');

//   // 2. Calculate the secret_key
//   const secretKey = crypto
//     .createHmac('sha256', 'WebAppData')
//     .update(botToken)
//     .digest('hex');

//   // 3. Calculate the expected hash
//   const expectedHash = crypto
//     .createHmac('sha256', secretKey)
//     .update(dataCheckString)
//     .digest('hex');

//   // 4. Compare the hashes and check the auth_date
//   const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
//   return expectedHash === data.hash && data.auth_date > now - 3600; // Allow for a 1-hour tolerance
// }
