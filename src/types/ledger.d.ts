export interface Wayfarer {
  id: string;
  name: string;
  journeyStarted: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LedgerStatus {
  ready: boolean;
  vaultPath: string | null;
  wayfarer: Wayfarer | null;
}

export interface VaultActionResult {
  success: boolean;
  cancelled?: boolean;
  error?: string;
  status?: LedgerStatus;
}

export type GearCategory =
  | "Footwear"
  | "Clothing"
  | "Armour"
  | "Accessories"
  | "Weaponry"
  | "Utilitarian"
  | "Maintenance & Storage";

export interface Gear {
  id: string;
  name: string;
  category: GearCategory | null;
  material: string | null;
  weight: string | null;
  colour: string | null;
  price: string | null;
  coverPhotoId: string | null;
  coverPhotoFilename: string | null;
  makerId: string | null;
  makerName: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GearFields {
  name: string;
  category?: GearCategory | null;
  material?: string | null;
  weight?: string | null;
  colour?: string | null;
  price?: string | null;
  photoPath?: string | null;
  makerId?: string | null;
}

export interface Maker {
  id: string;
  name: string;
  website: string | null;
  instagram: string | null;
  notes: string | null;
  logoPhotoId: string | null;
  logoPhotoFilename: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MakerFields {
  name: string;
  website?: string | null;
  instagram?: string | null;
  notes?: string | null;
  logoPhotoPath?: string | null;
}

export interface Festival {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  weather: string | null;
  notes: string | null;
  coverPhotoId: string | null;
  coverPhotoFilename: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FestivalFields {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  weather?: string | null;
  notes?: string | null;
  photoPath?: string | null;
}

export interface LedgerApi {
  getStatus: () => Promise<LedgerStatus>;
  vault: {
    chooseExisting: () => Promise<VaultActionResult>;
    createNew: (wayfarerName: string) => Promise<VaultActionResult>;
  };
  photos: {
    pickFile: () => Promise<string | null>;
  };
  gear: {
    list: () => Promise<Gear[]>;
    get: (id: string) => Promise<Gear | null>;
    create: (fields: GearFields) => Promise<Gear>;
    update: (id: string, fields: Partial<GearFields>) => Promise<Gear>;
    festivalsFor: (gearId: string) => Promise<Festival[]>;
    linkFestival: (gearId: string, festivalId: string) => Promise<void>;
    unlinkFestival: (gearId: string, festivalId: string) => Promise<void>;
  };
  makers: {
    list: () => Promise<Maker[]>;
    get: (id: string) => Promise<Maker | null>;
    create: (fields: MakerFields) => Promise<Maker>;
    update: (id: string, fields: Partial<MakerFields>) => Promise<Maker>;
    gearFor: (makerId: string) => Promise<Gear[]>;
  };
  festivals: {
    list: () => Promise<Festival[]>;
    get: (id: string) => Promise<Festival | null>;
    create: (fields: FestivalFields) => Promise<Festival>;
    update: (id: string, fields: Partial<FestivalFields>) => Promise<Festival>;
    gearFor: (festivalId: string) => Promise<Gear[]>;
  };
}

declare global {
  interface Window {
    ledger: LedgerApi;
  }
}
