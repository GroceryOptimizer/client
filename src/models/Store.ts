import { Coordinates } from "./Coordinates";

export interface Store {
  id: string;
  name: string;
  location: Coordinates;
}
