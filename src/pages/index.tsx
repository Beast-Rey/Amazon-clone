import Banner from "@/components/Banner";
import Products from "@/components/Products";
import { ProductProps } from "../../types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllProducts } from "@/store/nextSlice";

interface Props {
  productData: ProductProps;
}



export default function Home({productData}:Props) {
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(setAllProducts({ allProducts: productData }));
  }, [productData]);
  return (
    <main>
      <div className="max-w-screen-2xl mx-auto">
          <Banner />
          <div className="relative md:-mt-20 lgl-mt-32 xl:-mt-60 z-20 mb-10">
          <Products productData={productData}/>
          </div>
      </div>
    </main>
  )
}

export const getServerSideProps = async() => {
  const res = await fetch("https://fakestoreapiserver.reactbd.com/tech");
  const productData = await res.json();
  return { props: { productData } };
}
