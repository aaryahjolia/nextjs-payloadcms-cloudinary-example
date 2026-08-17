import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import { getCloudinaryURL } from "@/collections/Media";

export const dynamic = "force-dynamic";

const fallbackHeading = "Make space for what matters.";

export default async function Home() {
  const payload = await getPayload({ config });
  const home = await payload.findGlobal({ slug: "home" });
  const heading = home.heading || fallbackHeading;
  const image = typeof home.image === "object" ? home.image : null;
  const imageURL = image ? getCloudinaryURL(image) : null;

  return (
    <main className="flex flex-1 items-center justify-center bg-stone-50 px-6 py-16 text-center">
      <div className="max-w-3xl">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-stone-500">
          {home.subheading || "Welcome"}
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-stone-900 sm:text-7xl">
          {heading}
        </h1>
        {imageURL && (
          <Image
            src={imageURL}
            alt="Homepage image"
            width={image?.width || 1200}
            height={image?.height || 800}
            className="mx-auto mt-10 w-1/2 min-w-64 rounded-lg object-cover shadow-sm"
          />
        )}
      </div>
    </main>
  );
}
