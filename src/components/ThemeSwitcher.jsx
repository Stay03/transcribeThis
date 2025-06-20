import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    console.log('Switching theme from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleTheme()
      }}
      className="h-8 w-8 px-0"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}