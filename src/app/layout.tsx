import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Paddock | Dados e rádios de F1",
  description: "Acompanhe cada piloto de F1: voltas, posições, pneus e rádios de equipe em tempo real, via OpenF1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="text-center text-[11px] text-neutral-600 py-4">
          Foto de fundo: Circuit Zandvoort por{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Aerial_view_of_Motorsport_race_track_Circuit_Zandvoort_Formula_one_(40889997713).jpg"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-neutral-400"
          >
            dronepicr
          </a>
          , licença CC BY 2.0
        </footer>
      </body>
    </html>
  );
}
