const BrandToState = {
  betmgm: ['nj', 'mi', 'pa', 'wv', 'on'],
  borgata: ['nj', 'pa'],
  partycasino: ['nj'],
  wof: ['nj', 'on'],
};

const BrandToDomain = {
  betmgm: 'betmgm',
  borgata: 'borgataonline',
  partycasino: 'partycasino',
  wof: 'wheeloffortunecasino',
};

type BrandToStateKeys = keyof typeof BrandToState;

export function isValidBrand(brand?: string): brand is BrandToStateKeys {
  return brand !== undefined && Object.keys(BrandToState).includes(brand);
}

export function isValidLabel(brand: string, state?: string): brand is BrandToStateKeys {
  if (!isValidBrand(brand)) {
    return false;
  }

  return state === undefined || BrandToState[brand].includes(state);
}

export function getCasinoBaseUrl(
  brand: string | null,
  state: string | null,
  { gameSubdomain = false } = {}
): string {
  if (!brand || !state || !isValidLabel(brand, state)) {
    throw new Error('Invalid label');
  }

  const domain = BrandToDomain[brand];
  const segments: Record<string, string | null> = {
    subdomain: gameSubdomain ? 'casinogames' : 'www',
    state,
    domain,
    tld: 'com',
  };

  // MC ON has a '.ca' top-level domain
  if (brand === 'betmgm' && state === 'on') {
    segments.tld = 'ca';
  }

  // BC NJ and WOF NJ don't have a state subdomain
  const isBCNJ = brand === 'borgata' && state === 'nj';
  const isWOFNJ = brand === 'wof' && state === 'nj';
  if (isBCNJ || isWOFNJ) {
    segments.state = null;
  }

  return `https://${Object.values(segments).filter(Boolean).join('.')}`;
}
