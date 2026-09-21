// Shared shapes returned by the FastAPI backend's JSON endpoints. These mirror
// the old Prisma models field-for-field, except relations are nested arrays
// (e.g. Project.images) instead of separate joined tables, and dates are ISO
// strings rather than Date objects. Every field below is always present in
// the backend's response (nullable fields are always sent as `null`, never
// omitted), matching how Prisma's generated types worked.

export type SiteSettings = {
  tagline: string | null;
  introTitle: string | null;
  introBody: string | null;
  finalCtaTitle: string | null;
  finalCtaBody: string | null;
  heroVideoUrl: string | null;
  phone: string | null;
  phoneSecondary: string | null;
  email: string | null;
  address: string | null;
  locationPrimaryName: string | null;
  locationPrimaryLabel: string | null;
  locationSecondaryName: string | null;
  locationSecondaryLabel: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  whatsappUrl: string | null;
};

export type GalleryImage = {
  id: string;
  url: string;
  mediaType: "image" | "video";
  alt: string | null;
  order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  location: string | null;
  description: string | null;
  featuredImage: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images: GalleryImage[];
};

export type ConstructionProject = {
  id: string;
  title: string;
  slug: string;
  categoryLabel: string | null;
  location: string | null;
  description: string | null;
  featuredImage: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images: GalleryImage[];
};

export type DesignWorkImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
};

export type DesignWork = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  scope: string;
  roomType: string | null;
  description: string | null;
  featuredImage: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  images: DesignWorkImage[];
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  mediaType: "image" | "video";
  order: number;
  published: boolean;
  parentId: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  description: string | null;
  order: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  kind: "review" | "video" | "photo";
  customerName: string;
  reviewText: string | null;
  location: string | null;
  rating: number | null;
  videoUrl: string | null;
  thumbnail: string | null;
  response: string | null;
  order: number;
  published: boolean;
  createdAt: string;
};

export type SocialPost = {
  id: string;
  platform: string;
  embedUrl: string;
  thumbnail: string | null;
  caption: string | null;
  order: number;
  published: boolean;
};

export type MediaFeature = {
  id: string;
  title: string;
  outlet: string;
  type: string;
  url: string;
  thumbnail: string | null;
  order: number;
  published: boolean;
  createdAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "read" | "handled";
  createdAt: string;
};

export type CostEstimatorRates = {
  cementPerBag: number;
  sandPerCuFt: number;
  aggregatePerCuFt: number;
  brickPerPc: number;
  steelPerKg: number;
  economyRatePerSqFt: number;
  standardRatePerSqFt: number;
  premiumRatePerSqFt: number;
};
