import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowBik — AI Integration & Web Development",
  description:
    "We build intelligent software — AI integrations and modern web apps that move your business forward. Partner with Flowbik to transform your digital presence.",
  keywords: "AI integration, web development, machine learning, chatbot, automation, Next.js, FastAPI",
  openGraph: {
    title: "Flowbik — AI Integration & Web Development",
    description: "We build intelligent software that moves your business forward.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans bg-white text-zinc-900 dark:bg-[#080810] dark:text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}