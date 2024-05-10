import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { BiSend } from 'react-icons/bi';

import { Image } from '~/components/Image';
import CustomAxios, { baseURL } from '~/config/api';
import useCartContext from '~/hooks/useCartContext';
import { addToCart } from '~/reducers/cartReducer';
import moment from 'moment';

function ProductDetail() {
  const { product } = useParams();
  const getHash = CryptoJS.Rabbit.decrypt(product, 'hashUrlProductDetail');
  const productId = CryptoJS.enc.Utf8.stringify(getHash);
  const nav = useNavigate();

  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [categoryId, setCategoryId] = useState(0);
  const [manufacturerId, setManufacturerId] = useState(0);

  const [productInfo, setProductInfo] = useState();
  const [comments, setComments] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  // eslint-disable-next-line
  const [stateCart, dispatchCart] = useCartContext();

  useEffect(() => {
    if (!productId) {
      nav('/');
    }
  }, [product]);

  useEffect(() => {
    getProductById();
    getCommentByProductId();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    relatedProduct();
    // eslint-disable-next-line
  }, [productInfo]);
  const getProductById = async () => {
    try {
      const res = await CustomAxios.get(`/api/v1/products/${productId}`);
      setProductInfo(res.data);
      setCategoryId(res.data.category.id);
      setManufacturerId(res.data.manufacturer.id);
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentByProductId = async () => {
    try {
      const res = await CustomAxios.get(`/api/v1/comments/${productId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const relatedProduct = async () => {
    try {
      const res = await CustomAxios.post(`/api/v1/products/related-products`, {
        categoryId: categoryId,
        manufacturerId: manufacturerId,
      });
      setRelatedProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddtoCart = (product, imageUrl, related) => {
    dispatchCart(
      addToCart({
        productId: product.id,
        nameProduct: product.name,
        currentPrice: product.salePrice,
        imageUrl: imageUrl,
        quantity: related ? 1 : quantity,
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
  const handleInputComment = (commentContent) => {
    if (!commentContent.startsWith(' ') && !commentContent.startsWith('\n')) {
      setComment(commentContent);
    } else {
      setComment('');
      toast.error('Please input more than 5 words!', {
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
    }
  };
  const handleSubmitComment = async () => {
    if (!comment.startsWith(' ') && !comment.startsWith('\n') && comment.length > 5) {
      try {
        const res = await CustomAxios.post(
          '/api/v1/comments/create',
          {
            productId: productId,
            content: comment,
          },
          {
            headers: {
              'x-accesstoken': JSON.parse(localStorage.getItem('userInfo')).accessToken,
            },
          },
        );
        if (res.status === 200) {
          toast.success(res.data.msg, {
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
          getCommentByProductId();
        } else {
          toast.error(res.data.msg, {
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
        }
      } catch (error) {
        console.log(error);
      }

      setComment('');
    } else {
      toast.error('Please input more than 5 words!', {
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
    }
  };
  return (
    productInfo && (
      <>
        <ToastContainer />
        <div className="mt-12 container flex flex-col lg:grid lg:grid-cols-2 gap-6">
          <div>
            <Image
              src={baseURL + '/' + productInfo.imageproducts[0].url}
              alt={productInfo.name}
              className="w-full scale-75 hover:scale-90 ease-in duration-500 "
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold uppercase mb-2">{productInfo.name}</h2>
            <div className="flex items-center mb-4">
              <div className="text-base sm:text-lg text-gray-500 ml-3">{comments.length} comments</div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 font-semibold space-x-2 text-lg sm:text-xl">
                <span>Availability: </span>
                <span className="text-green-600">In Stock</span>
              </p>
              <p className="space-x-2 text-lg sm:text-xl">
                <span className="text-gray-800 font-semibold ">Manufacturer: </span>
                <span className="text-gray-600">{productInfo.manufacturer.manufacturerName}</span>
              </p>
              <p className="space-x-2 text-lg sm:text-xl">
                <span className="text-gray-800 font-semibold">Category: </span>
                <span className="text-gray-600">{productInfo.category.type}</span>
              </p>
            </div>
            <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
              <p className="text-xl sm:text-2xl text-primary font-semibold">
                {productInfo.salePrice.toLocaleString()} VND
              </p>
              <p className="text-xl sm:text-2xl text-gray-400 line-through">{productInfo.price.toLocaleString()} VND</p>
            </div>

            <p className="mt-4 text-gray-600 text-lg sm:text-xl">{productInfo.description}</p>

            <div className="pt-4">
              <h3 className="text-lg sm:text-xl text-gray-800 mb-3 uppercase font-medium">Color</h3>

              <div className="color-selector ">
                <input type="radio" name="color" id="red" className="hidden" />
                <label
                  for="red"
                  className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"
                  style={{ backgroundColor: `${productInfo.color}` }}
                ></label>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
              <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                <button
                  onClick={() => quantity > 1 && setQuantity((pre) => pre - 1)}
                  className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                >
                  -
                </button>
                <div className="h-8 w-8 text-base flex items-center justify-center">{quantity}</div>
                <button
                  onClick={() => setQuantity((pre) => pre + 1)}
                  className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3 pb-5 pt-5">
              <button
                className="text-lg sm:text-2xl text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2  hover:bg-slate-600 bg-slate-500 hover:text-black transition"
                onClick={() => handleAddtoCart(productInfo, baseURL + '/' + productInfo.imageproducts[0].url)}
              >
                <i className="fa-solid fa-bag-shopping"></i> Add to cart
              </button>
            </div>
          </div>
        </div>
        <div className="container pb-16">
          <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">Comments</h3>
          <div className=" overflow-hidden mt-2 py-2 px-4 rounded-xl w-full md:w-2/3 lg:w-1/3 min-h-14 max-h-72 flex justify-start items-center border-2 border-slate-500">
            <textarea
              className="appearance-none outline-none shadow-none resize border-none flex-1 h-full  border-transparent focus:shadow-none focus:border-transparent focus:border-none focus:outline-none text-base caret-teal-500 "
              onChange={(e) => handleInputComment(e.target.value)}
              value={comment}
            ></textarea>
            <BiSend className="ml-2 cursor-pointer" onClick={handleSubmitComment} />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/5 pt-6 flex flex-col-reverse">
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-center">
                  <h4 className="text-base sm:text-xl font-bold">
                    {comment.user.firstName} {comment.user.lastName}
                  </h4>
                  <span className="text-xs font-normal ml-3 ">
                    {moment(new Date(comment.createdAt).toISOString()).format('MMMM Do YYYY')}
                  </span>
                </div>
                <p className="text-base sm:text-lg">{comment.content}</p>
                <div className="w-full md:w-2/3 lg:w-3/5 h-[1px] bg-slate-500 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="container pb-16">
          <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">Related products</h2>
          <div className="grid sm:grid-cols-2 sm:gap-3 md:grid-cols-4 md:gap-5">
            {relatedProducts.map(
              (relatedProduct) =>
                relatedProduct.id !== productInfo.id && (
                  <div className="bg-white shadow rounded overflow-hidden group" key={relatedProduct.id}>
                    <div className="relative">
                      <Image
                        src={baseURL + '/' + relatedProduct.imageproducts[0].url}
                        alt={relatedProduct.name}
                        className="w-full object-cover scale-75 group-hover:scale-100 ease-in duration-500"
                      />
                    </div>
                    <div className="pt-4 pb-3 px-4">
                      <a href="##">
                        <h4 className="uppercase font-medium text-xl mb-2 text-gray-600 hover:text-gray-900 transition text-ellipsis overflow-hidden whitespace-nowrap">
                          {relatedProduct.name}
                        </h4>
                      </a>
                      <div className="flex items-baseline mb-1 space-x-2">
                        <p className="text-xl text-primary font-semibold">
                          {relatedProduct.salePrice.toLocaleString()} VND
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          {relatedProduct.price.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleAddtoCart(relatedProduct, baseURL + '/' + relatedProduct.imageproducts[0].url, 'related')
                      }
                      className="block w-full py-1 text-center text-white border border-primary rounded-b hover:bg-slate-600 bg-slate-500 hover:text-black transition"
                    >
                      Add to cart
                    </button>
                  </div>
                ),
            )}
          </div>
        </div>
      </>
    )
  );
}
export default ProductDetail;
