import { useEffect, useState } from 'react';
import { ModalDetail } from '~/components/ModalDetail';

import CustomAxios from '~/config/api';
import useDebounce from '~/hooks/useDebounce';

const limit = 5;

function ProductPage() {
  // const accessToken = localStorage.getItem();
  // axios.interceptors.request.use()
  const [toggleModal, setToggleModal] = useState(false);

  const [detailOrder, setDetailOrder] = useState();

  const [orders, setOrder] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const debounced = useDebounce(searchValue, 600);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [offSet, setOffSet] = useState(0);
  const [total, setTotal] = useState(0);

  const totalPage = Math.ceil(total / limit);

  useEffect(() => {
    let page = [];
    for (let i = 0; i < totalPage; i++) {
      page.push(i);
    }
    setPages(page);

    // eslint-disable-next-line
  }, [orders]);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!debounced.trim()) {
      getOrders();
    } else {
      searchOrder(debounced);
    }
    // eslint-disable-next-line
  }, [debounced, offSet]);

  const tokens = JSON.parse(localStorage.getItem('userInfo'));

  const getOrders = async () => {
    const res = await CustomAxios.get('/api/v1/orders/', {
      headers: { 'x-accesstoken': tokens.accessToken },
      params: {
        limit: limit,
        offset: offSet,
      },
    });
    setOrder(res.data.rows);
    setTotal(res.data.count);
  };

  const deleteOrder = async (id) => {
    try {
      await CustomAxios.delete(`/api/v1/orders/${id}`, { headers: { 'x-accesstoken': tokens.accessToken } });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const searchOrder = async (value) => {
    try {
      const res = await CustomAxios.get(`/api/v1/orders/search/${value}`, {
        headers: { 'x-accesstoken': tokens.accessToken },
      });

      setOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchOrder = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePaging = (currentPosition) => {
    setOffSet(currentPosition * limit);
    setCurrentPage(currentPosition);
  };
  const handlePreNext = (status) => {
    if (status === 'pre') {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        pages.forEach((page) => {
          if (page === currentPage) {
            setOffSet((currentPage - 1) * limit);
          }
        });
      }
    } else {
      if (currentPage < total / limit - 1) {
        setCurrentPage(currentPage + 1);
        pages.forEach((page) => {
          if (page === currentPage) {
            setOffSet((currentPage + 1) * limit);
          }
        });
      }
    }
  };
  const handleShowDetail = async (orderId) => {
    try {
      const res = await CustomAxios.get(`/api/v1/orders/order-detail/${orderId}`, {
        headers: { 'x-accesstoken': tokens.accessToken },
      });

      console.log(res.data);
      setDetailOrder(res.data);
    } catch (error) {
      console.log(error);
    }
    setToggleModal(true);
  };
  const handleToggleModal = () => {
    setToggleModal(false);
    setDetailOrder();
    getOrders();
  };
  return (
    <div className=" flex  flex-1 justify-center items-center p-10">
      <div className=" w-full relative shadow-md sm:rounded-lg ">
        <div className="flex justify-start">
          <div className="mb-3 xl:w-96">
            <div className="input-group relative flex flex-wrap items-stretch w-full mb-4 rounded">
              <input
                value={searchValue}
                onChange={handleSearchOrder}
                type="search"
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              />
            </div>
          </div>
        </div>
        <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Address
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
              <th scope="col" className="py-3 px-6">
                Cancel
              </th>
              <th scope="col" className="py-3 px-6">
                Time
              </th>

              <th scope="col" className="py-3 px-6">
                Phone
              </th>
              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="py-4 px-6">{order.user.firstName}</td>
                <td className="py-4 px-6">{order.shippingAddress}</td>
                <td className="py-4 px-6">{order.status}</td>
                <td className="py-4 px-6">{order.cancelOrder === true ? 'Cancel' : 'No'}</td>
                <td className="py-4 px-6">{order.createdAt.slice(0, 10)}</td>

                <td className="py-4 px-6">{order.user.phone}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleShowDetail(order.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav className="flex justify-between items-center pt-4 text-base" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white">
              {offSet + 1 + '-' + (offSet + limit > total ? total : offSet + limit)}
            </span>
            of <span className="font-semibold text-gray-900 dark:text-white">{total}</span>
          </span>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => handlePreNext('pre')}
                className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            {pages.map((position) => (
              <li key={position}>
                <button
                  onClick={() => handlePaging(position)}
                  className={
                    currentPage === position
                      ? ' text-blue-600 bg-blue-50  py-2 px-3 leading-tight hover:bg-blue-100 hover:text-blue-700 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      : 'py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }
                >
                  {position + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePreNext('next')}
                className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {toggleModal && <ModalDetail toggleModal={handleToggleModal} detail={detailOrder} />}
    </div>
  );
}

export default ProductPage;
