import { addDays, format, parse } from 'date-fns';

export const GreenCardOptions = [
  { value: '15', title: '15 zile' },
  { value: '30', title: '1 lună' },
  { value: '60', title: '2 luni' },
  { value: '90', title: '3 luni' },
  { value: '120', title: '4 luni' },
  { value: '150', title: '5 luni' },
  { value: '180', title: '6 luni' },
  { value: '210', title: '7 luni' },
  { value: '240', title: '8 luni' },
  { value: '270', title: '9 luni' },
  { value: '300', title: '10 luni' },
  { value: '330', title: '11 luni' },
  { value: '365', title: '12 luni' },
];

const IDNP_REGEX = /^((2\d{12})|(09\d{11}))$/;
const IDNO_REGEX = /^(1\d{12})$/;

const validate = (value: any, regex: any) => {
  if (!regex.test(value)) {
    return false;
  }

  const crc = value
    .substring(0, 12)
    .split('')
    .reduce(
      (acc: any, char: any, i: any) =>
        acc + Number(char) * (i % 3 === 0 ? 7 : i % 3 === 1 ? 3 : 1),
      0
    );

  return Number(value[12]) === crc % 10;
};
export const isNumeric = (str: string): boolean => {
  return str.split('').every((char) => char >= '0' && char <= '9');
};
export const Companies = {
  'acord-grup': 'Acord Grup',
  moldcargo: 'Moldcargo',
  intact: 'Intact',
  general: 'General',
  donaris: 'Donaris',
  transelit: 'Transelit',
  moldasig: 'Moldasig',
  grawe: 'Grawe',
  asterra: 'Asterra',
};

export const GreenCardCompanies = [
  Companies.asterra,
  Companies.intact,
  Companies.donaris,
  Companies.grawe,
  Companies.moldasig,
  // Companies.MOLDCARGO,
];

export const validateIDNP = (value: any) => validate(value, IDNP_REGEX);
export const validateIDNO = (value: any) => validate(value, IDNO_REGEX);

// export const getNextThreeDays = (): string[] => {
//   const formatDate = (date: Date): string => {
//     return format(date, 'dd.MM.yyyy');
//   };
//   const today = new Date();
//   const tomorrow = addDays(today, 1);
//   const dayAfterTomorrow = addDays(today, 2);

//   return [
//     formatDate(today),
//     formatDate(tomorrow),
//     formatDate(dayAfterTomorrow),
//   ];
// };
// export const getNextThreeDaysForAPI = (): string[] => {
//   const formatDate = (date: Date): string => {
//     return format(date, 'yyyy-MM-dd');
//   };
//   const today = new Date();
//   const tomorrow = addDays(today, 1);
//   const dayAfterTomorrow = addDays(today, 2);

//   return [
//     formatDate(today),
//     formatDate(tomorrow),
//     formatDate(dayAfterTomorrow),
//   ];
// };
export const getNextTenDays = (): string[] => {
  const formatDate = (date: Date): string => {
    return format(date, 'dd.MM.yyyy');
  };

  const today = new Date();
  const nextTenDays = Array.from({ length: 10 }, (_, i) =>
    formatDate(addDays(today, i))
  );

  return nextTenDays;
};

export const getNextTenDaysForAPI = (): string[] => {
  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const today = new Date();
  const nextTenDays = Array.from({ length: 10 }, (_, i) =>
    formatDate(addDays(today, i))
  );

  return nextTenDays;
};
export const formatDateForAPI = (date: any): string => {
  const parsedDate = parse(date, 'dd.MM.yyyy', new Date());
  return format(parsedDate, 'yyyy-MM-dd');
};
