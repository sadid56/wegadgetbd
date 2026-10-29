import { supabase } from "@/lib/supabase";

export const BUCKET_NAME = "we-gadgets";
const storage = supabase.storage.from(BUCKET_NAME);

export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "https://bftjqobykjnrtaaqzokb.supabase.co";

const ASSETS_BASE = ASSETS_URL.replace(/\/+$/, "");
const OBJECT_PREFIX = "storage/v1/object/public/";
const LOCAL_PREFIXES = ["/images/", "/logo", "/avatars/", "/placeholder", "images/", "logo", "avatars/"];

type UploadOptions = {
  file: File;
  folder?: string;
};

function sanitizePath(folderPath: string) {
  return folderPath
    .split("/")
    .map((segment) => segment.trim().replace(/\s+/g, "-").toLowerCase())
    .join("/");
}

export function generateStorageKey(fileName: string, folderPath?: string) {
  const folder = folderPath ? sanitizePath(folderPath) : "";
  const name = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
  return folder ? `${folder}/${name}` : name;
}

export function getStoragePath(key: string, bucket = BUCKET_NAME) {
  return `${bucket}/${key.replace(/^\/+/, "")}`;
}

export function getAssetUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path);
      if (url.hostname.endsWith(".supabase.co") && url.pathname.includes(`/${OBJECT_PREFIX}`)) {
        return `${ASSETS_BASE}${url.pathname}`;
      }
    } catch {}
    return path;
  }

  if (LOCAL_PREFIXES.some((p) => path.startsWith(p))) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  const clean = path.replace(/^\/+/, "");

  if (clean.startsWith(OBJECT_PREFIX)) {
    return `${ASSETS_BASE}/${clean}`;
  }

  if (clean.startsWith(`${BUCKET_NAME}/`)) {
    return `${ASSETS_BASE}/${OBJECT_PREFIX}${clean}`;
  }

  return `${ASSETS_BASE}/${OBJECT_PREFIX}${BUCKET_NAME}/${clean}`;
}

export const getImageUrl = getAssetUrl;

export function stripAssetDomain(urlOrPath?: string | null): string {
  if (!urlOrPath) return "";
  let clean = urlOrPath.trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    try {
      clean = new URL(clean).pathname;
    } catch {}
  }

  clean = clean.replace(/^\/+/, "");

  if (clean.startsWith(OBJECT_PREFIX)) {
    clean = clean.substring(OBJECT_PREFIX.length);
  }

  if (["images/", "logo", "avatars/", "placeholder"].some((p) => clean.startsWith(p))) {
    return `/${clean}`;
  }

  return clean.startsWith(`${BUCKET_NAME}/`) ? clean : `${BUCKET_NAME}/${clean}`;
}

export function getStorageKeyFromUrl(urlOrPath: string, bucket = BUCKET_NAME): string {
  const clean = stripAssetDomain(urlOrPath);
  const withoutBucket = clean.startsWith(`${bucket}/`) ? clean.substring(bucket.length + 1) : clean;
  return withoutBucket.replace(/^\/+/, "");
}

export async function uploadFileToStorage({ file, folder }: UploadOptions) {
  const key = generateStorageKey(file.name, folder);
  const { error } = await storage.upload(key, file);
  if (error) throw error;

  const path = getStoragePath(key);
  return {
    key,
    path,
    url: path,
    publicUrl: getAssetUrl(path),
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function deleteFileFromStorage(keyOrUrl: string) {
  const { error } = await storage.remove([getStorageKeyFromUrl(keyOrUrl)]);
  if (error) throw error;
}

export async function deleteMultipleFilesFromStorage(keysOrUrls: string[]) {
  if (keysOrUrls.length === 0) return;
  const { error } = await storage.remove(keysOrUrls.map((k) => getStorageKeyFromUrl(k)));
  if (error) throw error;
}

export async function moveFileInStorage(oldKeyOrUrl: string, newKey: string) {
  const { error } = await storage.move(getStorageKeyFromUrl(oldKeyOrUrl), newKey);
  if (error) throw error;
  const path = getStoragePath(newKey);
  return { publicUrl: getAssetUrl(path), path, url: path, key: newKey };
}