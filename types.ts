// Payload types for the application

export interface Page {
  id: number
  title: string
  type: string
  route: string
  description?: string
  stage?: {
    main: string,
    subStage?: number | string
  }
  newPage?: boolean
  hasIteration?: boolean
  iterations?: {
    phase: string
    version: number
    notes?: string
  }[]
}

// Output types for the application