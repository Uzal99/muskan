# Video Editor Portfolio

A black & red portfolio site for a video editor, with a full admin panel to edit everything — no code changes needed after setup.

**Stack:** Next.js 15 (App Router, Server Actions) · Prisma · PostgreSQL on Supabase · Supabase Storage · Tailwind CSS · Netlify

## What you get

**Public site** — hero with optional looping background video and showreel modal · scrolling tools banner · filterable project grid · project pages with YouTube / Vimeo / MP4 embeds · services · about + stats · testimonials · contact form · SEO metadata, sitemap and robots.txt.

**Admin panel (`/admin`)** — edit hero, about, stats, tools, contact details, social links and SEO · add / edit / reorder / publish / delete projects · manage services and testimonials · read contact-form messages · upload images · change login email and password.

---

## 1. Supabase setup (free tier)

1. Create a project at [supabase.com](https://supabase.com).
2. **Database connection strings** — click **Connect** and copy:
   - *Transaction pooler* (port **6543**) → `DATABASE_URL`, and append `?pgbouncer=true&connection_limit=1`
   - *Session pooler* (port **5432**) → `DIRECT_URL`

   (The session pooler works over IPv4; the plain `db.<ref>.supabase.co` host is IPv6-only on the free tier.)
3. **Storage** → New bucket named `portfolio`, **Public bucket: on**. Under the bucket settings set a file size limit of `5 MB` and allowed MIME types `image/jpeg, image/png, image/webp, image/gif, image/avif`.
4. **Project Settings → API**: copy the project URL, the `anon`/publishable key and the `service_role`/secret key.

## 2. Run locally

```bash
npm install
cp .env.example .env        # fill in every value
openssl rand -base64 48     # paste the output as AUTH_SECRET

npm run db:push             # creates the tables in Supabase
npm run db:seed             # creates your admin user + starter content
npm run dev                 # http://localhost:3000  ·  admin at /admin
```

Sign in at `/admin` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Re-running `npm run db:seed` resets that password if you ever get locked out (it never overwrites your site content).

> The seed adds **sample projects and one sample testimonial**. Replace or delete them from the admin panel before going live.

## 3. Deploy to Netlify (free tier)

1. Push this folder to a GitHub repository.
2. Netlify → **Add new site → Import from Git** → pick the repo. Netlify detects Next.js automatically; `netlify.toml` sets the build command and Node 20.
3. **Site settings → Environment variables** — add:

   | Variable | Notes |
   |---|---|
   | `DATABASE_URL` | pooled, port 6543 |
   | `DIRECT_URL` | session pooler, port 5432 |
   | `AUTH_SECRET` | 32+ random characters |
   | `NEXT_PUBLIC_SUPABASE_URL` | |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
   | `SUPABASE_SERVICE_ROLE_KEY` | mark as secret |
   | `SUPABASE_BUCKET` | `portfolio` |
   | `NEXT_PUBLIC_SITE_URL` | your final URL, e.g. `https://yourname.netlify.app` |

   `ADMIN_EMAIL` / `ADMIN_PASSWORD` are only used by the seed script on your own machine — don't add them to Netlify.
4. Deploy. Visit `/admin/login`.

Run `db:push` and `db:seed` **from your computer** (step 2) against the same Supabase database — the Netlify build doesn't touch the schema.

## How editing works

- Public pages are cached (ISR, 5 min) so visitors get fast loads and your free-tier usage stays low. Every save in the admin calls `revalidatePath`, so changes go live within seconds.
- Images upload straight from the browser to Supabase Storage via a short-lived signed URL (works around Netlify's ~6 MB function body limit; the service-role key never reaches the browser).
- Videos are **links** (YouTube, Vimeo or a direct `.mp4`/`.webm`) — free-tier storage is too small for video files. YouTube links supply their own thumbnail; for Vimeo/MP4 upload a thumbnail.
- Hero headline: wrap words in `*stars*` to make them red.

## Security notes

- Admin sessions are signed JWTs in an `httpOnly`, `SameSite=Lax` cookie; passwords are bcrypt-hashed.
- `/admin/*` is guarded by middleware, the admin layout, and every server action re-checks the session.
- The contact form has a honeypot field plus database-backed flood limits. Messages are stored, not emailed — check the Messages tab (or add an email service later).
- Supabase free projects **pause after ~1 week of inactivity**. While paused the site shows fallback content and the admin can't load. Resume the project from the Supabase dashboard (or upgrade) if that happens.

## Project structure

```
prisma/            schema.prisma, seed.ts
src/middleware.ts  protects /admin
src/actions/       server actions (auth, settings, projects, services, testimonials, messages, contact, upload)
src/lib/           prisma, auth, supabase, video parsing, data access, defaults
src/app/(site)/    public pages
src/app/admin/     login + admin panel
src/components/    site/ (public UI) and admin/ (forms, sidebar, uploader)
```

## Scripts

`npm run dev` · `npm run build` · `npm run typecheck` · `npm run db:push` · `npm run db:seed` · `npm run db:studio`

## Customising the look

Colours live in `tailwind.config.ts` (`brand` = red, `ink` = blacks). Fonts (Bebas Neue + Inter) are set in `src/app/layout.tsx`.
