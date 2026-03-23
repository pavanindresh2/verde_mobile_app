export interface User {
  _id: string;         
  name: string;
  email: string;
  role?: string;
  profilePhoto?: string;
  organisation?: string;
}

export type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
  details?: {
    name?: string | null;
    street?: string | null;
    district?: string | null;
    city?: string | null;
    subregion?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
};
