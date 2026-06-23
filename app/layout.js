import "./globals.css";

export const metadata = {
  title: "WEG Granja",
  description: "Projeto de implantação",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
