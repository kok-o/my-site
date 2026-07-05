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
