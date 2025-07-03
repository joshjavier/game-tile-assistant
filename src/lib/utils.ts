const BrandToState = {
  betmgm: ['nj', 'mi', 'pa', 'wv', 'on'],
  borgata: ['nj', 'pa'],
  partycasino: ['nj'],
  wof: ['nj', 'on'],
};

type BrandToStateKeys = keyof typeof BrandToState;

export function isValidBrand(brand?: string): brand is BrandToStateKeys {
  return brand !== undefined && Object.keys(BrandToState).includes(brand);
}

export function isValidLabel(brand?: string, state?: string): boolean {
  if (!isValidBrand(brand)) {
    return false;
  }

  return state === undefined || BrandToState[brand].includes(state);
}
