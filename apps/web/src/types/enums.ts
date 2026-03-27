/**
 * Local enum definitions mirroring the Prisma schema enums.
 * These replace the broken `@onlyjs/db/enums` import path.
 */

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  NON_BINARY = "NON_BINARY",
}

export enum RoleType {
  BASIC = "BASIC",
  ADMIN = "ADMIN",
  CUSTOM = "CUSTOM",
}

export enum OrganizationType {
  COMPANY = "COMPANY",
}

export enum UserScope {
  SYSTEM = "SYSTEM",
  COMPANY = "COMPANY",
}

export enum FileLibraryAssetType {
  PRODUCT_IMAGE = "PRODUCT_IMAGE",
  USER_IMAGE = "USER_IMAGE",
  SCHOOL_LOGO = "SCHOOL_LOGO",
  PRODUCT_BRAND_LOGO = "PRODUCT_BRAND_LOGO",
  SCHOOL_BRAND_LOGO = "SCHOOL_BRAND_LOGO",
}

export enum FileLibraryAssetFileType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
}

export enum FileLibraryAssetMimeType {
  IMAGE_JPEG = "IMAGE_JPEG",
  IMAGE_PNG = "IMAGE_PNG",
  IMAGE_GIF = "IMAGE_GIF",
  IMAGE_WEBP = "IMAGE_WEBP",
  IMAGE_SVG = "IMAGE_SVG",
  IMAGE_BMP = "IMAGE_BMP",
  IMAGE_TIFF = "IMAGE_TIFF",
  VIDEO_MP4 = "VIDEO_MP4",
  VIDEO_AVI = "VIDEO_AVI",
  VIDEO_MPEG = "VIDEO_MPEG",
  VIDEO_WEBM = "VIDEO_WEBM",
  VIDEO_OGG = "VIDEO_OGG",
  DOCUMENT_PDF = "DOCUMENT_PDF",
  DOCUMENT_MSWORD = "DOCUMENT_MSWORD",
  DOCUMENT_DOCX = "DOCUMENT_DOCX",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}
