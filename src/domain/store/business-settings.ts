export interface BusinessSettings {
  currency: 'USD'
  country: 'EC'
  timezone: 'America/Guayaquil'
  monthlySalesGoal?: number
  fixedCosts?: number
}

export const defaultBusinessSettings: BusinessSettings = {
  currency: 'USD',
  country: 'EC',
  timezone: 'America/Guayaquil',
}
