export type ApiError = {
  message: string
}

export type State = {
  code: number,
  name: string
}

export type Municipality = {
  code: number,
  name: string
}

export type Parish = {
  code: number,
  name: string
}

export type Center = {
  code: number,
  name: string
}

export type GetStatesResponse = {
  states: State[]
}

export type GetMunicipalitiesResponse = {
  municipalities: Municipality[]
}

export type GetParishesResponse = {
  parishes: Parish[]
}

export type GetCentersResponse = {
  centers: Center[]
}

