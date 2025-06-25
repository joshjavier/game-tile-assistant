import { IoAlertCircle } from 'react-icons/io5'
import classes from './DeprecationBanner.module.css'

export const DeprecationBanner = () => {
  return (
    <header className={classes.banner}>
      <IoAlertCircle size={20} aria-label="Notice" className={classes.icon} />
      <p>
        Game Tiles Assemble is no longer functional due to recent API updates.
        The tool is now deprecated and will no longer be maintained.
      </p>
    </header>
  )
}
