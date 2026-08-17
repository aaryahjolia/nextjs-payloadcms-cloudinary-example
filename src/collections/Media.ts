import { readFile } from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import type { CollectionConfig } from "payload";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type UploadFile = {
  data?: Buffer;
  tempFilePath?: string;
};

export function getCloudinaryURL(media: {
  cloudinaryPublicId?: null | string;
  cloudinaryURL?: null | string;
}) {
  if (media.cloudinaryURL) {
    return media.cloudinaryURL;
  }

  if (media.cloudinaryPublicId) {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${media.cloudinaryPublicId}`;
  }

  return null;
}

async function uploadToCloudinary(file: UploadFile) {
  const fileData = file.data?.length
    ? file.data
    : file.tempFilePath
      ? await readFile(file.tempFilePath)
      : null;

  if (!fileData) {
    throw new Error("The image upload did not include file data.");
  }

  return new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "payload-home",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary did not return an upload result."));
          return;
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      },
    );

    stream.end(fileData);
  });
}

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
  },
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ["image/*"],
    adminThumbnail: ({ doc }) => getCloudinaryURL(doc) || "",
  },
  fields: [
    {
      name: "cloudinaryPublicId",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "cloudinaryURL",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!req.file) {
          return data;
        }

        const uploadedImage = await uploadToCloudinary(req.file as UploadFile);

        return {
          ...data,
          cloudinaryPublicId: uploadedImage.public_id,
          cloudinaryURL: uploadedImage.secure_url,
        };
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
            resource_type: "image",
          });
        }
      },
    ],
  },
};
