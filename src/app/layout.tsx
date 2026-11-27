import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "VIBOVYTM — Футбольная аналитика",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4 pb-8 px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}