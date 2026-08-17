# Next.js + Payload + Cloudinary homepage

This project is a small content-managed website. Editors change the homepage in
Payload's admin panel, and the public Next.js site reads those changes directly
from Payload. Uploaded images are stored in Cloudinary rather than on the web
server.

## How the system works

```text
Editor → Payload Admin (/admin) → PostgreSQL
              │                    │
              └─ image upload → Cloudinary
                                   │
Visitor → Next.js homepage (/) ← Payload global + Cloudinary image URL
```

- **Next.js** renders the public site at `/`. The homepage is dynamically
  rendered, so published content changes are visible on the next request; no
  redeploy is needed for normal content updates.
- **Payload** provides the CMS and admin panel at `/admin`. It stores user
  accounts, homepage settings, and media records in PostgreSQL.
- **Cloudinary** stores the actual image files. Each Payload media record saves
  its Cloudinary public ID and secure URL. When an image is deleted from
  Payload, the project also asks Cloudinary to remove the corresponding asset.

The `Home page` global has three editor-controlled fields: a heading,
subheading, and optional homepage image. The public page retrieves this global
on the server and displays its current values.

## Requirements

- Node.js 20.9 or later
- pnpm 11 (the package manager pinned by this repository)
- A PostgreSQL database
- A Cloudinary account

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Fill in every value described in [Environment variables](#environment-variables).

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000/admin](http://localhost:3000/admin) and create
   the first Payload user when prompted. This account is used to sign in to the
   CMS.

6. Open [http://localhost:3000](http://localhost:3000) to view the public
   website.

## Test admin access

To test the CMS, go to `/admin` and sign in with:

```text
Email:    test@gmail.com
Password: test
```

Please do not change this account's password. If the admin page does not open or
these credentials do not work, contact the repository owner using the email
address listed on their GitHub profile.

## Editing website content

1. Sign in at `/admin`.
2. In the navigation, select **Globals → Home page**.
3. Update the **Main heading** or **Subheading**.
4. To add or replace the visual, upload an image in **Collections → Media**.
   Then select that media item in the **Homepage image** field on the Home page
   global.
5. Save the Home page. Refresh `/` to see the current content.

Media accepts image files only. Images are uploaded into the `payload-home`
folder in the configured Cloudinary account. Payload keeps image metadata and a
Cloudinary reference in the database, while Cloudinary serves the image itself.

## Environment variables

Keep these values in `.env` locally and configure the same values in the
environment settings of the deployment platform. Do not commit `.env`, and do
not expose the secret values in browser code.

| Variable | What to enter | How to get it |
| --- | --- | --- |
| `DATABASE_URL` | A full PostgreSQL connection string, such as `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require` | Create a PostgreSQL database with a provider such as [Neon](https://neon.com/), Supabase, Railway, or your own server. In that provider's database connection settings, copy the PostgreSQL connection string. Enable or retain SSL parameters if the provider supplies them. |
| `PAYLOAD_SECRET` | A long, unique random secret | Generate it locally with `openssl rand -base64 32`, then paste the output. Use a different value for each environment and keep it stable after deployment because Payload uses it to secure sessions and tokens. |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Sign in to the [Cloudinary Console](https://console.cloudinary.com/). The **Product Environment Credentials** area shows the cloud name. |
| `CLOUDINARY_API_KEY` | The API key for that Cloudinary product environment | In the same Cloudinary credentials area, copy **API Key**. |
| `CLOUDINARY_API_SECRET` | The API secret for that Cloudinary product environment | In the same Cloudinary credentials area, reveal and copy **API Secret**. Treat it like a password. |

Your completed `.env` should look like this (use your real values, never these
placeholders):

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
PAYLOAD_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Useful routes

| Route | Purpose |
| --- | --- |
| `/` | Public homepage |
| `/admin` | Payload admin panel |
| `/api/globals/home` | Payload REST endpoint for the Home page global |
| `/api/media` | Payload REST endpoint for media records |
| `/api/media/file/:filename` | Redirects a Payload media filename to its Cloudinary image URL |

## Commands

```bash
pnpm dev      # run locally with hot reload
pnpm lint     # run ESLint
pnpm build    # create a production build
pnpm start    # run the production build
```

## Deployment notes

Provision PostgreSQL and Cloudinary first, add all five environment variables to
your hosting provider, then deploy the application. The public site needs
outbound access to PostgreSQL and Cloudinary. Ensure the database connection
string is appropriate for the host environment—most managed PostgreSQL services
require SSL.
