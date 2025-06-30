import { IoAlertCircle } from 'react-icons/io5'
import classes from './DeprecationBanner.module.css'

export const DeprecationBanner = () => {
  return (
    <header className={classes.banner}>
      <IoAlertCircle size={20} aria-label="Notice" className={classes.icon} />
      <p>
        Game Tiles Assemble is now in maintenance mode due to recent API
        updates. A new and improved version is currently in the works—stay
        tuned!
      </p>
    </header>
  )
}
