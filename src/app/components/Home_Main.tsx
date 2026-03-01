import NavBar from "./design_lib/navbar";
import Header from "./hero_section/heading/header";
import FeaturedProducts from "./hero_section/featured_product_data_fetching/FeaturedProducts";
import SocialMedia from "./hero_section/contact_media/SocialMedia";
import Footer from "./hero_section/credits/Footer";
import { ModalProvider } from "@/app/contexts/ModalContext";

const Home_Main = () => {
  return (
    <ModalProvider>
      <NavBar />
      <Header />
      <FeaturedProducts />
      <SocialMedia />
      <Footer />
    </ModalProvider>
  )
}

export default Home_Main;