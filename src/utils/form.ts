import parsePhoneNumber, {AsYouType} from 'libphonenumber-js/mobile';

export function getValidNumber(number: string, code?: string) {
  if (number) {
    try {
      const phoneNumber = parsePhoneNumber(code || '' + number);
      return phoneNumber?.isPossible() || false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

export const unMaskPhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d\+]/g, '');
};

export const removeSymbolsFormPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[^0-9+]/g, '');
};

export function formatPhoneNumber(number: string) {
  const phoneNumber = parsePhoneNumber(
    removeSymbolsFormPhoneNumber(number),
    'US',
  );
  if (phoneNumber) {
    return `+${phoneNumber.countryCallingCode} ${new AsYouType('US').input(
      phoneNumber.nationalNumber,
    )}`;
  }
  return '';
}

export const phoneNumberWithoutSymbols = (phoneNumber: string) => {
  return removeSymbolsFormPhoneNumber(formatPhoneNumber(phoneNumber));
};
