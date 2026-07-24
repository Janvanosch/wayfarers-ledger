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

export interface Outfit {
  id: string;
  name: string;
  coverPhotoId: string | null;
  coverPhotoFilename: string | null;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OutfitFields {
  name: string;
  photoPath?: string | null;
}

export interface OutfitVersion {
  id: string;
  outfitId: string;
  version: number;
  gearIds: string[];
  gear: Gear[];
  notes: string | null;
  createdAt: string;
}

export interface OutfitVersionFields {
  gearIds: string[];
  notes?: string | null;
}

export interface JournalPhoto {
  id: string;
  filename: string;
}

export interface JournalEntry {
  id: string;
  title: string | null;
  body: string;
  festivalId: string | null;
  festivalName: string | null;
  gear: Gear[];
  outfits: Outfit[];
  photos: JournalPhoto[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface JournalEntryFields {
  title?: string | null;
  body: string;
  festivalId?: string | null;
  gearIds?: string[];
  outfitIds?: string[];
  photoPaths?: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  relatedType: string | null;
  relatedId: string | null;
  occurredAt: string;
  createdAt: string;
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
  outfits: {
    list: () => Promise<Outfit[]>;
    get: (id: string) => Promise<Outfit | null>;
    create: (fields: OutfitFields) => Promise<Outfit>;
    update: (id: string, fields: Partial<OutfitFields>) => Promise<Outfit>;
    createVersion: (
      id: string,
      fields: OutfitVersionFields,
    ) => Promise<OutfitVersion>;
    versions: (id: string) => Promise<OutfitVersion[]>;
    currentGear: (id: string) => Promise<Gear[]>;
  };
  journal: {
    list: () => Promise<JournalEntry[]>;
    get: (id: string) => Promise<JournalEntry | null>;
    listForFestival: (festivalId: string) => Promise<JournalEntry[]>;
    create: (fields: JournalEntryFields) => Promise<JournalEntry>;
    update: (
      id: string,
      fields: Partial<JournalEntryFields>,
    ) => Promise<JournalEntry>;
  };
  timeline: {
    list: (limit?: number) => Promise<TimelineEvent[]>;
  };
}

declare global {
  interface Window {
    ledger: LedgerApi;
  }
}
