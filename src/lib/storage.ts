import { supabase, supabaseAdmin } from "@/lib/supabase";

export const BUCKET_NAME = "we-gadgets";
const getStorageClient = () => (supabaseAdmin || supabase).storage.from(BUCKET_NAME);
const storage = supabase.storage.from(BUCKET_NAME);

export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "https://bftjqobykjnrtaaqzokb.supabase.co";

const ASSETS_BASE = ASSETS_URL.replace(/\/+$/, "");
const OBJECT_PREFIX = "storage/v1/object/public/";

type UploadOptions = {
  file: File;
  folder?: string;
};

function sanitizePath(folderPath: string): string {
  return folderPath
    .split("/")
    .map((segment) => segment.trim().replace(/\s+/g, "-").toLowerCase())
    .join("/");
}

function parseHttpUrl(path: string): URL | null {
  if (!path.startsWith("http://") && !path.startsWith("https://")) return null;
  try {
    return new URL(path);
  } catch {
    return null;
  }
}

export function generateStorageKey(fileName: string, folderPath?: string): string {
  const folder = folderPath ? sanitizePath(folderPath) : "";
  const name = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
  return folder ? `${folder}/${name}` : name;
}

export function getStoragePath(key: string, bucket?: string): string {
  const cleanKey = key.replace(/^\/+/, "");
  return bucket && bucket !== BUCKET_NAME ? `${bucket}/${cleanKey}` : cleanKey;
}

export function getAssetUrl(path?: string | null): string {
  if (!path) return "";

  const url = parseHttpUrl(path);
  if (url) {
    const isSupabase = url.hostname.endsWith(".supabase.co");
    const hasObjectPrefix = url.pathname.includes(`/${OBJECT_PREFIX}`);
    return isSupabase && hasObjectPrefix ? `${ASSETS_BASE}${url.pathname}` : path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

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

  const input = urlOrPath.trim();
  const url = parseHttpUrl(input);
  let clean = (url ? url.pathname : input).replace(/^\/+/, "");

  if (clean.startsWith(OBJECT_PREFIX)) {
    clean = clean.substring(OBJECT_PREFIX.length);
  }

  if (clean.startsWith(`${BUCKET_NAME}/`)) {
    return clean.substring(BUCKET_NAME.length + 1);
  }

  return clean;
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

export async function deleteFileFromStorage(keyOrUrl: string): Promise<void> {
  const client = getStorageClient();
  const { error } = await client.remove([getStorageKeyFromUrl(keyOrUrl)]);
  if (error) throw error;
}

export async function deleteMultipleFilesFromStorage(keysOrUrls: string[]): Promise<void> {
  if (keysOrUrls.length === 0) return;
  const client = getStorageClient();
  const { error } = await client.remove(keysOrUrls.map((k) => getStorageKeyFromUrl(k)));
  if (error) throw error;
}

export async function moveFileInStorage(oldKeyOrUrl: string, newKey: string) {
  const { error } = await storage.move(getStorageKeyFromUrl(oldKeyOrUrl), newKey);
  if (error) throw error;

  const path = getStoragePath(newKey);
  return { publicUrl: getAssetUrl(path), path, url: path, key: newKey };
}