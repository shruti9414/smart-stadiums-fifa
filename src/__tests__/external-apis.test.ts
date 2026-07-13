import {
  getWeatherData,
  getTransitOptions,
  calculateCarbonFootprint,
  getSustainabilityMetrics,
} from '@/lib/external-apis'

describe('External APIs', () => {
  describe('getWeatherData', () => {
    it('should return weather data with required fields', async () => {
      const weather = await getWeatherData(25.3548, 51.5507)

      expect(weather).toHaveProperty('temperature')
      expect(weather).toHaveProperty('condition')
      expect(weather).toHaveProperty('humidity')
      expect(weather).toHaveProperty('windSpeed')
      expect(weather).toHaveProperty('recommendation')
      expect(weather).toHaveProperty('icon')
    })

    it('should return numeric temperature', async () => {
      const weather = await getWeatherData(25.3548, 51.5507)
      expect(typeof weather.temperature).toBe('number')
      expect(weather.temperature).toBeGreaterThanOrEqual(-50)
      expect(weather.temperature).toBeLessThanOrEqual(60)
    })

    it('should return valid humidity percentage', async () => {
      const weather = await getWeatherData(25.3548, 51.5507)
      expect(weather.humidity).toBeGreaterThanOrEqual(0)
      expect(weather.humidity).toBeLessThanOrEqual(100)
    })

    it('should provide recommendation based on temperature', async () => {
      const weather = await getWeatherData(25.3548, 51.5507)
      expect(weather.recommendation).toBeTruthy()
      expect(weather.recommendation.length).toBeGreaterThan(0)
    })
  })

  describe('getTransitOptions', () => {
    it('should return array of transit options', async () => {
      const options = await getTransitOptions('Doha', 'Lusail Stadium')
      expect(Array.isArray(options)).toBe(true)
      expect(options.length).toBeGreaterThan(0)
    })

    it('should have all required transit fields', async () => {
      const options = await getTransitOptions('Doha', 'Lusail Stadium')

      options.forEach((option) => {
        expect(option).toHaveProperty('type')
        expect(option).toHaveProperty('name')
        expect(option).toHaveProperty('duration')
        expect(option).toHaveProperty('distance')
        expect(option).toHaveProperty('cost')
        expect(option).toHaveProperty('carbonEmission')
        expect(option).toHaveProperty('availability')
      })
    })

    it('should include metro option as least carbon emissive', async () => {
      const options = await getTransitOptions('Doha', 'Lusail Stadium')
      const metro = options.find((o) => o.type === 'metro')

      expect(metro).toBeDefined()
      expect(metro?.carbonEmission).toBeLessThan(1)
    })

    it('should adjust costs for multiple passengers', async () => {
      const single = await getTransitOptions('Doha', 'Lusail Stadium', 1)
      const triple = await getTransitOptions('Doha', 'Lusail Stadium', 3)

      const taxiSingle = single.find((o) => o.type === 'taxi')
      const taxiTriple = triple.find((o) => o.type === 'taxi')

      expect(taxiTriple!.cost).toBeGreaterThan(taxiSingle!.cost)
    })
  })

  describe('calculateCarbonFootprint', () => {
    it('should return carbon data with required fields', async () => {
      const carbon = await calculateCarbonFootprint(100, 'metro', 15)

      expect(carbon).toHaveProperty('totalEmission')
      expect(carbon).toHaveProperty('savedByPublicTransit')
      expect(carbon).toHaveProperty('offsetOpportunities')
      expect(carbon).toHaveProperty('recommendation')
    })

    it('should calculate zero emission for metro', async () => {
      const carbon = await calculateCarbonFootprint(1, 'metro', 1)
      expect(carbon.totalEmission).toBeLessThan(0.1)
    })

    it('should calculate higher emission for car', async () => {
      const carbonMetro = await calculateCarbonFootprint(1, 'metro', 10)
      const carbonCar = await calculateCarbonFootprint(1, 'car', 10)

      expect(carbonCar.totalEmission).toBeGreaterThan(carbonMetro.totalEmission)
    })

    it('should provide offset opportunities', async () => {
      const carbon = await calculateCarbonFootprint(50, 'car', 20)
      expect(Array.isArray(carbon.offsetOpportunities)).toBe(true)
      expect(carbon.offsetOpportunities.length).toBeGreaterThan(0)
    })

    it('should recommend public transit over car', async () => {
      const carbon = await calculateCarbonFootprint(1, 'car', 15)
      expect(carbon.recommendation.toLowerCase()).toContain('consider')
    })
  })

  describe('getSustainabilityMetrics', () => {
    it('should return sustainability metrics', async () => {
      const metrics = await getSustainabilityMetrics()

      expect(metrics).toHaveProperty('carbonNeutralAchieved')
      expect(metrics).toHaveProperty('renewableEnergyPercentage')
      expect(metrics).toHaveProperty('wasteDivertedPercentage')
      expect(metrics).toHaveProperty('waterSavedLiters')
      expect(metrics).toHaveProperty('certificationsHeld')
      expect(metrics).toHaveProperty('impactStatement')
    })

    it('should have valid energy percentage', async () => {
      const metrics = await getSustainabilityMetrics()
      expect(metrics.renewableEnergyPercentage).toBeGreaterThanOrEqual(0)
      expect(metrics.renewableEnergyPercentage).toBeLessThanOrEqual(100)
    })

    it('should report carbon neutrality', async () => {
      const metrics = await getSustainabilityMetrics()
      expect(metrics.carbonNeutralAchieved).toBe(true)
    })

    it('should have certifications', async () => {
      const metrics = await getSustainabilityMetrics()
      expect(Array.isArray(metrics.certificationsHeld)).toBe(true)
      expect(metrics.certificationsHeld.length).toBeGreaterThan(0)
    })
  })
})
