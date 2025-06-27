'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, User } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/pricing', label: 'Pricing' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur border-b border-border">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl gradient-text">
          <span role="img" aria-label="logo">🎬</span> VideoSaaS
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors font-medium px-2 py-1 rounded-md ${pathname.startsWith(link.href) ? 'bg-primary text-white' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/account" className="ml-2 p-2 rounded-full hover:bg-accent transition-colors">
            <User className="h-5 w-5" />
          </Link>
        </div>
        {/* Mobile Nav */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-black shadow-lg flex flex-col p-6 gap-4 animate-slide-in-from-right">
              <button className="self-end mb-4" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium px-2 py-2 rounded-md ${pathname.startsWith(link.href) ? 'bg-primary text-white' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="mt-4 p-2 rounded-full hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link href="/account" className="mt-2 p-2 rounded-full hover:bg-accent transition-colors">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 