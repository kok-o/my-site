# Personal Portfolio

A modern, responsive personal portfolio website built with Next.js and Tailwind CSS. It features smooth scroll animations, dark mode support, internationalization, and a beautiful UI designed with Shadcn UI and Framer Motion.

##  Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Internationalization**: `react-intl`
- **Theming**: `next-themes` (Dark/Light mode)
- **Carousels**: `embla-carousel-react`

##  Getting Started

### Prerequisites
Make sure you have Node.js installed (v20+ recommended).

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. Run the development server (runs on port 8080 by default):
   ```bash
   npm run dev
   ```

3. Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

##  Scripts

- `npm run dev` - Starts the development server on port 8080
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to catch issues in the code

##  Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components (Hero, About, Project Cards, Scroll Reveal, etc.)
- `lib/` - Utility functions and helpers
- `public/` - Static assets like images and icons

##  Features
- **Responsive Design**: Flawless experience across all devices.
- **Dark Mode**: Toggle between light and dark themes effortlessly.
- **Scroll Animations**: Engaging UI transitions powered by Framer Motion.
- **Multi-language Support**: Designed with internationalization in mind.

## Portfolio pages

- `/` — the homepage with projects, experience, skills and contacts. Navigation scrolls to the corresponding section.
- `/projects/contextos`, `/projects/story-forecaster`, `/projects/code-ai` and `/projects/ai-miky` - project overviews, demonstrations or galleries, technology and source links.
- Previous `/projects`, `/about` and `/contact` URLs redirect to the corresponding homepage sections.

Homepage navigation uses smooth section scrolling. Links from project case studies
return directly to the relevant homepage section. Page changes between the homepage
and case studies use progressive View Transitions, including browser back/forward.
The site respects `prefers-reduced-motion`, keeps theme and language preferences
across routes, and includes the homepage and case studies in its sitemap.

Before publishing, run `npm run lint` and `npm run build`. Check a direct project
URL as well as navigation from the homepage, browser back/forward, mobile menus,
the screenshot galleries, and each language in both themes.

Portfolio content lives in `lib/constants.ts` and the three `locales/*.json` files.
The About section separates open-source contributions from internships. Technology
logos are local SVG assets from Simple Icons; project media origins are recorded
in each new project's `SOURCE.md`.

Both header and mobile-menu resume links select `/resume/Nurkhan_Esenbek_RU.pdf`
for Russian and Kazakh, and `/resume/Nurkhan_Esenbek_EN.pdf` for English.
`/cv.pdf` keeps an up-to-date English copy for existing direct links.

The header shows only the mark while the homepage name is visible, then reveals
the wordmark on scroll. Project pages show the wordmark immediately. Technology
buttons open localized work examples from `lib/skill-usage.ts`; links lead to
project pages, contribution anchors, or the source repository.
Selecting a technology centers it and fades out the other marks; selecting it
again or pressing Escape restores the grid. The introductory hint stays hidden
after the first selection for the browser visit.
