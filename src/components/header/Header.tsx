import logo from '../../images/logo.png'
import Image from 'next/image';
import { BiCaretDown } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import Link from 'next/link';
import cartIcon from "../../images/cartIcon.png";
import { useDispatch, useSelector } from 'react-redux';
import { StateProps, StoreProduct } from '../../../types';
import {useSession, signIn, signOut} from 'next-auth/react'
import { useEffect, useState } from 'react';
import { addUser } from '@/store/nextSlice';
import SearchProducts from '../SearchProducts';

export default function Header() {
  const {data:session} = useSession()
  const dispatch = useDispatch()
  const [allData, setallData] = useState([])
  const {productData, favoriteData, userInfo, allProducts} = useSelector((state:StateProps) => state.next)

  useEffect(() => {
    if(session) {
      dispatch(addUser({
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image
      }))
    }
  }, [session])

  useEffect(() => {
    setallData(allProducts.allProducts)
  }, [])

 const [searchQuery, setSearchQuery] = useState("")
 const [filteredProducts, setfilteredProducts] = useState([])

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
 }

 useEffect(() => {
  const filtered = allData.filter((item: StoreProduct) =>
    item.title.toLocaleLowerCase().includes(searchQuery.toLowerCase())
  );
  setfilteredProducts(filtered);
}, [searchQuery]);

  return (
    <nav className="w-full h-20 bg-amazon_blue text-lightText sticky top-0 z-50">
      <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-4">
        <Link href="/" className='px-2 border border-transparent hover:border-white cursor-pointer duration-300 flex justify-center items-center h-[70%]'>
        <Image className="w-28 object-cover mt-1" src={logo} alt="logo" />
        </Link>
        <div className='px-2 border border-transparent hover:border-white cursor-pointer duration-300 justify-center items-center h-[70%] xl:inline-flex gap-1'>
          <SlLocationPin />
          <div className='text-xs'>
          <p>Delivery</p>
          <p className='text-white font-bold uppercase'>USA</p>
          </div>
        </div>
        <div className='flex-1 h-10 hidden md:inline-flex items-center justify-between relative'>
          <input onChange={handleSearch} value={searchQuery} type="text" placeholder='search product here...' className='w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none focus-visible:border-amazon_yellow'/>
          <span className='w-12 h-full bg-amazon_yellow text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md'>
            <HiOutlineSearch />
          </span>
          {searchQuery && (
            <div className="absolute left-0 top-12 w-full mx-auto max-h-96 bg-gray-200 rounded-lg overflow-y-scroll cursor-pointer text-black">
              {filteredProducts.length > 0 ? (
                <>
                  {searchQuery &&
                    filteredProducts.map((item: StoreProduct) => (
                      <Link
                        key={item._id}
                        className="w-full border-b-[1px] border-b-gray-400 flex items-center gap-4"
                        href={{
                          pathname: `${item._id}`,
                          query: {
                            _id: item._id,
                            brand: item.brand,
                            category: item.category,
                            description: item.description,
                            image: item.image,
                            isNew: item.isNew,
                            oldPrice: item.oldPrice,
                            price: item.price,
                            title: item.title,
                          },
                        }}
                        onClick={() => setSearchQuery("")}
                      >
                        <SearchProducts item={item} />
                      </Link>
                    ))}
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center py-10 rounded-lg shadow-lg">
                  <p className="text-xl font-semibold animate-bounce">
                    Nothing is matches with your search keywords. Please try
                    again!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {userInfo ? (
          <div className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
            <Image
              src={userInfo.image}
              alt="userImage"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div className="text-xs text-gray-100 flex flex-col justify-between">
              <p className="text-white font-bold">{userInfo.name}</p>
              <p>{userInfo.email}</p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => signIn()}
            className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]"
          >
            <p>Hello, sign in</p>
            <p className="text-white font-bold flex items-center">
              Account & Lists{" "}
              <span>
                <BiCaretDown />
              </span>
            </p>
          </div>
        )}
        <Link href="/favorite" className='text-sm text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative'>
          <p>Marked</p>
          <p className='text-white'>& Favorite</p>
          {favoriteData.length > 0 && <span className='absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-sm font-bold text-amazon_yellow'>{favoriteData.length}</span> }
        </Link>
        <Link href="/cart" className='flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative'>
          <Image className='w-auto object-cover h-8' src={cartIcon} alt='cart-img'/>
          <p className='text-xs text-white font-bold mt-3'>Cart</p>
          <span className='absolute text-amazon_yellow text-sm top-2 left-[29px] font-semibold'>{productData.length}</span>
        </Link>
      </div>
    </nav>
  );
}
