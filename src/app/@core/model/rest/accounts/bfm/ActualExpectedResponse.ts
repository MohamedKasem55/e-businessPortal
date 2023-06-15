export interface ActualExpectedResponse {
  actual: { income: { currency: string, total: number }, expense: { currency: string, total: number } },
  expected: { income: { currency: string, total: number }, expense: { currency: string, total: number } }
}
