import styles from './elegant-dark-pattern.module.css'

// Each stop pattern cuts a different set of soft bands into the same diagonal wash.
const bandMasks = [
  'transparent 0%, black 20%, transparent 36%, black 55%, rgb(0 0 0 / 13%) 67%, black 78%, transparent 97%',
  'transparent 11%, black 25%, rgb(0 0 0 / 55%) 41%, rgb(0 0 0 / 13%) 67%, black 78%, transparent 97%',
  'transparent 9%, black 20%, rgb(0 0 0 / 55%) 28%, rgb(0 0 0 / 42%) 40%, black 48%, rgb(0 0 0 / 27%) 54%, rgb(0 0 0 / 13%) 78%, black 88%, transparent 97%',
  'transparent 0%, black 17%, rgb(0 0 0 / 55%) 26%, black 35%, transparent 47%, rgb(0 0 0 / 13%) 69%, black 79%, transparent 97%',
  'transparent 0%, black 20%, rgb(0 0 0 / 55%) 27%, black 42%, transparent 48%, rgb(0 0 0 / 13%) 67%, black 74%, black 82%, rgb(0 0 0 / 47%) 88%, transparent 97%',
]

export function HeroGradientBackground() {
  return (
    <div className={styles.pattern} aria-hidden="true">
      <div className={styles.wash}>
        {bandMasks.map(mask => (
          <span key={mask} className={styles.band} style={{ maskImage: `linear-gradient(90deg, ${mask})` }} />
        ))}
      </div>
    </div>
  )
}
