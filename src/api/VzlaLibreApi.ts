import type { AxiosInstance } from "axios";
import type { ApiError, GetCentersResponse, GetMunicipalitiesResponse, GetParishesResponse, GetStatesResponse, GetTablesResponse, State } from "./types";

export class VzlaLibreApi {

  constructor(private axiosInstance: AxiosInstance) {
  }

  async getStates() {
    const { status, data: _data } = await this.axiosInstance.get<GetStatesResponse | ApiError>("/states");
    if (status !== 200) {
      const error = _data as ApiError;
      throw new Error(error.message || "Ha ocurrido un error al obtener los estados");
    }

    const data = _data as GetStatesResponse;
    return data.states;
  }

  async getMunicipalitiesForState(stateCode: number) {
    const { status, data: _data } = await this.axiosInstance.get<GetMunicipalitiesResponse | ApiError>(`/states/${stateCode}/municipalities`);
    if (status !== 200) {
      const error = _data as ApiError;
      throw new Error(error.message || "Ha ocurrido un error al obtener los municipios");
    }

    const data = _data as GetMunicipalitiesResponse;
    return data.municipalities;
  }

  async getParishesForMunicipality(municipalityCode: number) {
    const { status, data: _data } = await this.axiosInstance.get<GetParishesResponse | ApiError>(`/municipalities/${municipalityCode}/parishes`);
    if (status !== 200) {
      const error = _data as ApiError;
      throw new Error(error.message || "Ha ocurrido un error al obtener las parroquias");
    }

    const data = _data as GetParishesResponse;
    return data.parishes;
  }

  async getCentersForParish(parishCode: number) {
    const { status, data: _data } = await this.axiosInstance.get<GetCentersResponse | ApiError>(`/parishes/${parishCode}/centers`);
    if (status !== 200) {
      const error = _data as ApiError;
      throw new Error(error.message || "Ha ocurrido un error al obtener los centros");
    }

    const data = _data as GetCentersResponse;
    return data.centers;
  }

  async getTablesForCenter(centerCode: number) {
    const { status, data: _data } = await this.axiosInstance.get<GetTablesResponse | ApiError>(`/centers/${centerCode}/tables`);
    if (status !== 200) {
      const error = _data as ApiError;
      throw new Error(error.message || "Ha ocurrido un error al obtener las mesas");
    }

    const data = _data as GetTablesResponse;
    return data.tables;
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    const { data } = await this.axiosInstance.get('/images', {
      params: {
        imageUrl
      }
    });

    const uint8Array = Uint8Array.from(data, (c: string) => c.charCodeAt(0));
    
    const blob = await new Blob([uint8Array], { type: 'image/jpeg' });
    return window.URL.createObjectURL(blob);
  }

  getImageUrl(imageUrl: string): string {
    return `${this.axiosInstance.defaults.baseURL}/images?imageUrl=${imageUrl}`;
  }
}