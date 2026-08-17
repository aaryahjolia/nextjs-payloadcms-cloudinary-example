import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import config from "@payload-config";
import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Args) {
  return generatePageMetadata({ config, params, searchParams });
}

export default async function Page({ params, searchParams }: Args) {
  const resolvedParams = await params;

  return RootPage({
    config,
    importMap,
    params: Promise.resolve({ segments: resolvedParams.segments || [] }),
    searchParams,
  });
}
