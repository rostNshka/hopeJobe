import { observer } from 'mobx-react-lite'
import { IoSunny } from 'react-icons/io5'
import { HiOutlineComputerDesktop } from 'react-icons/hi2'
import { FaRegMoon } from 'react-icons/fa'
import { themeStore } from '@/stores/theme-store'
import './ToggleTheme.scss'

const ToggleTheme = observer(() => {
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    themeStore.setTheme(theme)
  }

  const currentTheme = themeStore.theme

  return (
    <div className="theme-switcher">
      <button
        type="button"
        className={`theme-switcher_switch ${
          currentTheme === 'light' ? 'active' : ''
        }`}
        onClick={() => handleThemeChange('light')}
        aria-label="Switch to light theme"
        title="Светлая тема">
        <IoSunny className="theme-icon" />
      </button>

      <button
        type="button"
        className={`theme-switcher_switch ${
          currentTheme === 'system' ? 'active' : ''
        }`}
        onClick={() => handleThemeChange('system')}
        aria-label="Switch to system theme"
        title="Системная тема">
        <HiOutlineComputerDesktop className="theme-icon" />
      </button>

      <button
        type="button"
        className={`theme-switcher_switch ${
          currentTheme === 'dark' ? 'active' : ''
        }`}
        onClick={() => handleThemeChange('dark')}
        aria-label="Switch to dark theme"
        title="Тёмная тема">
        <FaRegMoon className="theme-icon" />
      </button>
    </div>
  )
})

export default ToggleTheme
