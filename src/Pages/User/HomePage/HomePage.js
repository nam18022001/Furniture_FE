import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';

import { Image } from '~/components/Image';
import CustomAxios, { baseURL } from '~/config/api';
import { FilterContext } from '~/contexts/FilterContextProvider';
import useCartContext from '~/hooks/useCartContext';
import { toast, ToastContainer } from 'react-toastify';
import { addToCart } from '~/reducers/cartReducer';

function UserPage() {
  // eslint-disable-next-line
  const [stateFilter, dispatchFilter] = useContext(FilterContext);
  // eslint-disable-next-line
  const [stateCart, dispatchCart] = useCartContext();

  const [allProduct, setAllProduct] = useState([]);
  // console.log(allProduct);

  const handleSelectSorting = (e) => {
    if (e.target.value === 'price-low-to-high') getPriceLowToHigh();
    else if (e.target.value === 'price-high-to-low') getPriceHighToLow();
    else if (e.target.value === 'latest') getLatestProducts();
    else getAllProduct();
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  useEffect(() => {
    if (stateFilter.categoryId !== 0 || stateFilter.manufacturerId !== 0 || stateFilter.color !== '') {
      getProductsByFilter(stateFilter.categoryId, stateFilter.manufacturerId, stateFilter.color);
    } else {
      getAllProduct();
    }
  }, [stateFilter]);

  const getAllProduct = async () => {
    const product = await CustomAxios.get('/api/v1/products/', {
      params: {
        limit: 1000,
        offset: 0,
      },
    });
    setAllProduct(product.data.rows);
  };
  //price low to high
  const getPriceLowToHigh = async () => {
    try {
      const res = await CustomAxios.get('/api/v1/products/price-low-to-high');
      setAllProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //price high to low
  const getPriceHighToLow = async () => {
    try {
      const res = await CustomAxios.get('/api/v1/products/price-high-to-low');
      setAllProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //latest products
  const getLatestProducts = async () => {
    try {
      const res = await CustomAxios.get('/api/v1/products/latest');
      setAllProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //filter
  const getProductsByFilter = async (categoryId, manufacturerId, color) => {
    try {
      const res = await CustomAxios.post('/api/v1/products/get-by-filter', {
        categoryId,
        manufacturerId,
        color,
      });
      setAllProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddtoCart = (product, imageUrl) => {
    dispatchCart(
      addToCart({
        productId: product.id,
        nameProduct: product.name,
        currentPrice: product.salePrice,
        imageUrl: imageUrl,
        quantity: 1,
      }),
    );
    toast.success('Add to cart successfully!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      style: {
        fontSize: '16px',
      },
    });
  };

  return (
    <>
      <div className="w-full col-span-12 lg:col-span-3 ">
        <div className="flex items-center mb-4">
          <select
            name="sort"
            id="sort"
            className="w-36 sm:w-44 text-l text-gray-600 py-3 px-4 border-gray-300 shadow-sm rounded focus:ring-primary focus:border-primary"
            onChange={handleSelectSorting}
          >
            <option value="">Default sorting</option>
            <option value="price-low-to-high">Price low to high</option>
            <option value="price-high-to-low">Price high to low</option>
            <option value="latest">Latest product</option>
          </select>
        </div>

        <div className="md:grid md:grid-cols-2 w-full lg:grid-cols-3 gap-6 h-[66rem] overflow-y-auto">
          {allProduct.length > 0 &&
            allProduct.map((product) => {
              let imageUrl;
              if (product.imageproducts.length > 0 && product.imageproducts[0]) {
                imageUrl = baseURL + '/' + product.imageproducts[0].url;
              } else {
                imageUrl = '';
              }
              return (
                <div
                  key={product.id}
                  className="shadow-[rgba(0,0,0,0.24)_0px_3px_8px] border !border-transparent hover:!border-slate-500 my-3 rounded"
                >
                  <Link
                    className="bg-white rounded overflow-hidden flex flex-col justify-between items-center"
                    to={`/product@${encodeURIComponent(
                      CryptoJS.Rabbit.encrypt(`${product.id}`, 'hashUrlProductDetail'),
                    )}`}
                  >
                    <div className="relative flex flex-col items-center">
                      <Image src={imageUrl} alt="product but error" className={'w-full h-fit object-contain'} />
                    </div>
                    <div className="pt-4 pb-3 px-4">
                      <div>
                        <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition text-ellipsis whitespace-nowrap overflow-hidden">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex flex-col mb-1 ">
                        <p className="text-base font-regular">
                          <span className="text-medium">Category:</span> {product.category.type}
                        </p>

                        <p className="text-base  font-regular">
                          <span className="text-medium">Manufacturer:</span> {product.manufacturer.manufacturerName}
                        </p>
                      </div>
                      <div className="flex items-baseline mb-1 space-x-2">
                        <p className="text-xl text-primary font-semibold">
                          {product.salePrice.toLocaleString() + ' VND'}
                        </p>
                        <p className="text-sm text-gray-400 line-through">{product.price.toLocaleString() + ' VND'}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex gap-1 text-sm text-yellow-400"></div>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="  block w-full py-1 text-center text-white border border-primary rounded-b hover:bg-slate-600 bg-slate-500 hover:text-black transition"
                    onClick={() => handleAddtoCart(product, imageUrl)}
                  >
                    Add to cart
                  </button>
                </div>
              );
            })}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default UserPage;
