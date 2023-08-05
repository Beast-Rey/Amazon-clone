import Footer from "./Footer";
import BottomHeader from "./header/BottomHeader";
import Header from "./header/Header";


interface Props {
    children: React.ReactNode;
  }

export default function RootLayout({children}:Props) {
  return (
    <>
    <Header />
    <BottomHeader />
    {children}
    <Footer />
    </>
  )
}
