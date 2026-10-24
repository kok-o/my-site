import { DM_Serif_Display } from 'next/font/google'

/** One shared font instance for the header and footer name. */
export const brandFont = DM_Serif_Display({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
})
