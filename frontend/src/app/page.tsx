import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Building from "./components/Building";
import Process from "./components/Process";
import WhyUs from "./components/WhyUs";
import FAQs from "./components/FAQs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Building />
        <Process />
        <WhyUs />
        <FAQs />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}