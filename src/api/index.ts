import axios from "axios";
import { VzlaLibreApi } from "./VzlaLibreApi"

let api: VzlaLibreApi | null = null;

export const getApi = () => {
  if (!api) {
    api = new VzlaLibreApi(axios.create({ baseURL: import.meta.env.VITE_BASE_URL }))
    console.log({ url: import.meta.env.VITE_BASE_URL });
  }

  return api;
}