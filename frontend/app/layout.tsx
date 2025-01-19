"use client";
import './globals.css'
import MasterProvider from './providers/MasterProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Todo dApp</title>
      </head>
      <body>
        <MasterProvider>
          {children}
        </MasterProvider>
      </body>
    </html>
  )
}
