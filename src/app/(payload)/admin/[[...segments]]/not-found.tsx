import { generatePageMetadata, NotFoundPage } from "@payloadcms/next/views";
import config from "@payload-config";
import { importMap } from "../importMap.js";

type Args = {
  params?: Promise<{ segments?: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata({
    config,
    params: params || Promise.resolve({ segments: [] }),
    searchParams: searchParams || Promise.resolve({}),
  });
}

export default async function NotFound({ params, searchParams }: Args) {
  const resolvedParams = (await params) || { segments: [] };

  return NotFoundPage({
    config,
    importMap,
    params: Promise.resolve({ segments: resolvedParams.segments || [] }),
    searchParams: searchParams || Promise.resolve({}),
  });
}
