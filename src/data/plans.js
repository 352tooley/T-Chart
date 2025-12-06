// T-Mobile Plan Data with pricing and benefits

export const TMOBILE_PLANS = {
  'Go5G Next': {
    name: 'Go5G Next',
    pricing: {
      1: { base: 90, autopay: 75 },
      2: { base: 140, autopay: 120 },
      3: { base: 180, autopay: 150 },
      4: { base: 200, autopay: 160 },
      5: { base: 225, autopay: 175 },
      6: { base: 250, autopay: 190 }
    },
    benefits: [
      'Unlimited premium data',
      'Unlimited mobile hotspot',
      '50GB high-speed hotspot',
      '4K UHD streaming',
      'Free Apple TV+, Netflix, & more',
      'Annual phone upgrade',
      'In-flight Wi-Fi & streaming'
    ]
  },
  'Go5G Plus': {
    name: 'Go5G Plus',
    pricing: {
      1: { base: 80, autopay: 65 },
      2: { base: 130, autopay: 110 },
      3: { base: 165, autopay: 135 },
      4: { base: 180, autopay: 140 },
      5: { base: 200, autopay: 160 },
      6: { base: 225, autopay: 175 }
    },
    benefits: [
      'Unlimited premium data',
      '50GB high-speed hotspot',
      '4K UHD streaming',
      'Free Apple TV+ & Netflix',
      'In-flight Wi-Fi',
      'Annual device upgrades'
    ]
  },
  'Go5G': {
    name: 'Go5G',
    pricing: {
      1: { base: 75, autopay: 60 },
      2: { base: 120, autopay: 100 },
      3: { base: 150, autopay: 120 },
      4: { base: 160, autopay: 120 },
      5: { base: 175, autopay: 135 },
      6: { base: 200, autopay: 150 }
    },
    benefits: [
      'Unlimited 5G & 4G LTE data',
      '15GB high-speed hotspot',
      'HD streaming',
      'Scam Shield Premium',
      'Device protection options'
    ]
  },
  'Magenta': {
    name: 'Magenta',
    pricing: {
      1: { base: 70, autopay: 55 },
      2: { base: 110, autopay: 90 },
      3: { base: 135, autopay: 105 },
      4: { base: 140, autopay: 100 },
      5: { base: 160, autopay: 120 },
      6: { base: 180, autopay: 135 }
    },
    benefits: [
      'Unlimited talk, text & data',
      '5GB high-speed hotspot',
      'SD streaming',
      'Scam Shield',
      'International texting'
    ]
  },
  'Essentials': {
    name: 'Essentials',
    pricing: {
      1: { base: 60, autopay: 50 },
      2: { base: 90, autopay: 75 },
      3: { base: 105, autopay: 85 },
      4: { base: 120, autopay: 95 },
      5: { base: 135, autopay: 105 },
      6: { base: 150, autopay: 120 }
    },
    benefits: [
      'Unlimited talk, text & data',
      'Unlimited 5G & 4G LTE',
      'SD streaming',
      'Basic calling features'
    ]
  }
}

export const HOME_INTERNET = {
  name: 'T-Mobile Home Internet',
  pricing: {
    base: 60,
    autopay: 50,
    withWireless: 35 // discount when bundled with wireless
  },
  benefits: [
    'No data caps',
    'No annual contracts',
    'No hidden fees',
    'Easy setup',
    '5G/4G LTE speeds'
  ]
}

// Calculate pricing with discounts
export function calculatePrice(basePlan, lineCount, discounts) {
  const plan = TMOBILE_PLANS[basePlan]
  if (!plan || !plan.pricing[lineCount]) return 0

  let price = discounts.autopay
    ? plan.pricing[lineCount].autopay
    : plan.pricing[lineCount].base

  // Apply insider discount (typically 20% off)
  if (discounts.insider) {
    price = price * 0.8
  }

  // Apply work perks (varies, using 15% as example)
  if (discounts.workPerks) {
    price = price * 0.85
  }

  // Free line discounts - subtract average line cost
  if (discounts.freeLines > 0 && lineCount > 1) {
    const perLineDiscount = price / lineCount
    price = price - (perLineDiscount * discounts.freeLines)
  }

  return Math.round(price * 100) / 100
}

export function calculateHomeInternet(hasAutopay, bundledWithWireless) {
  let price = HOME_INTERNET.pricing.base

  if (hasAutopay && bundledWithWireless) {
    price = HOME_INTERNET.pricing.withWireless
  } else if (hasAutopay) {
    price = HOME_INTERNET.pricing.autopay
  }

  return price
}
