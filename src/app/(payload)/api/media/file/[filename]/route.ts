import { getCloudinaryURL } from "@/collections/Media";
import config from "@payload-config";
import { getPayload } from "payload";

type Args = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, { params }: Args) {
  const { filename } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "media",
    limit: 1,
    where: {
      filename: {
        equals: filename,
      },
    },
  });
  const image = result.docs[0];
  const cloudinaryURL = image ? getCloudinaryURL(image) : null;

  if (!cloudinaryURL) {
    return new Response("Image not found", { status: 404 });
  }

  return Response.redirect(cloudinaryURL, 302);
}
