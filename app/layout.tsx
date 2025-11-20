import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "mytmux.life - Terminal Multiplexer Configurator",
  description: "Architect your perfect terminal development environment.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={jetbrainsMono.className}>
        <div className="scanline"></div>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 items-center px-4">
              <div className="mr-4 hidden md:flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <span className="hidden font-bold sm:inline-block text-primary">mytmux.life</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    /about
                  </Link>
                  <Link
                    href="https://github.com/tmux/tmux/wiki"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    /docs
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="py-6 md:px-8 md:py-0 border-t border-border">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by{" "}
                <a
                  href="https://github.com/Jeff-Emmett"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Jeff Emmett
                </a>
                . The source code is available on{" "}
                <a
                  href="https://github.com/Jeff-Emmett/mytmux.life-website"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
