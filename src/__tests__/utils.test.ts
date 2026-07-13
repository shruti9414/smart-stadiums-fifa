describe('Utility Functions', () => {
  describe('Data Validation', () => {
    const validateEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    it('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('admin@stadium.com')).toBe(true)
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid.email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user email@example.com')).toBe(false)
    })
  })

  describe('Number Formatting', () => {
    const formatCurrency = (amount: number, currency: string = 'USD'): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount)
    }

    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0.99)).toBe('$0.99')
    })

    it('should handle different currencies', () => {
      const qar = formatCurrency(100, 'QAR')
      expect(qar).toContain('100')
    })
  })

  describe('Date Formatting', () => {
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    it('should format date correctly', () => {
      const date = new Date('2026-06-21')
      const formatted = formatDate(date)
      expect(formatted).toContain('June')
      expect(formatted).toContain('21')
      expect(formatted).toContain('2026')
    })
  })

  describe('Array Operations', () => {
    const removeDuplicates = <T>(arr: T[]): T[] => {
      return Array.from(new Set(arr))
    }

    it('should remove duplicate values', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('should handle empty arrays', () => {
      expect(removeDuplicates([])).toEqual([])
    })

    it('should handle arrays with no duplicates', () => {
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3])
    })
  })

  describe('String Operations', () => {
    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
      expect(capitalize('lorem ipsum')).toBe('Lorem ipsum')
    })

    const truncate = (str: string, length: number): string => {
      return str.length > length ? str.substring(0, length) + '...' : str
    }

    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
      expect(truncate('Hi', 5)).toBe('Hi')
      expect(truncate('Test', 10)).toBe('Test')
    })
  })

  describe('Object Operations', () => {
    const mergeObjects = <T extends object>(obj1: T, obj2: Partial<T>): T => {
      return { ...obj1, ...obj2 }
    }

    it('should merge objects correctly', () => {
      const base = { name: 'Stadium', city: 'Doha' }
      const update = { city: 'Qatar' }
      const result = mergeObjects(base, update)

      expect(result.name).toBe('Stadium')
      expect(result.city).toBe('Qatar')
    })

    const deepEqual = (obj1: any, obj2: any): boolean => {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    }

    it('should compare objects for equality', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
      expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    })
  })

  describe('Range Validation', () => {
    const isInRange = (value: number, min: number, max: number): boolean => {
      return value >= min && value <= max
    }

    it('should validate ranges correctly', () => {
      expect(isInRange(50, 0, 100)).toBe(true)
      expect(isInRange(0, 0, 100)).toBe(true)
      expect(isInRange(100, 0, 100)).toBe(true)
      expect(isInRange(101, 0, 100)).toBe(false)
      expect(isInRange(-1, 0, 100)).toBe(false)
    })
  })

  describe('Unique ID Generation', () => {
    const generateId = (): string => {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
      expect(id1.length).toBeGreaterThan(10)
      expect(id2.length).toBeGreaterThan(10)
    })
  })
})
