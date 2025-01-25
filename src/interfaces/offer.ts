export type Offer = {
  company: string;
  currency: string;
  duration: number;
  max_interval: number;
  min_start_date: string;
  name: string;
  price: number;
  product: string;
  reference_exchange_rate: string;
  reference_price: string;
};
export const orderIdRegex = /^[IAM|IAE|IAI|IAF|IMB|IAO|ROV|TFD|MDV|RSA]{3}[0-9]{6}[A-Z]{3}$/

export enum InsuranceType {
    IAE = 'green-card',
    IAI = 'rca',
    // IAM = 'medical',
    // IAF = 'medical-optional',
    // IMB = 'real-estate',
    ROV = 'vignette:ro',
    // MDV = 'vignette:md',
    // BAGGAGE = 'baggage',
    // ROAD_TAX = 'road-tax',
    // ROAD_SIDE_ASSISTANCE_EU = 'roadside-assistance-eu',
  }