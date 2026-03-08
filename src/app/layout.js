import './globals.css';

export const viewport = {
  themeColor: '#F5F0EA',
  viewportFit: 'cover',
};

export const metadata = {
  title: 'Matej Dubiš — Behavioral & Decision Science, UX Research, Service Design',
  description:
    'Designing systems that work the way people actually think. Portfolio of Matej Dubiš — researcher and designer at the intersection of human behavior and design.',
  openGraph: {
    title: 'Matej Dubiš',
    description: 'Behavioral & Decision Science · UX Research · Service Design',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
