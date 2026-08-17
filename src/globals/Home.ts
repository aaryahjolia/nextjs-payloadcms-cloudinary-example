import type { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  label: "Home page",
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Main heading",
      required: true,
      defaultValue: "Make space for what matters.",
    },
    {
      name: "subheading",
      type: "text",
      label: "Subheading",
      required: true,
      defaultValue: "Welcome",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Homepage image",
    },
  ],
};
