import Navbar from "../../components/Navbar";

import Footer from "../../screen/home/footer";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen w-full  bg-[#030b1f]  ">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
