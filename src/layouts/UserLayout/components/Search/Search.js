import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

import { Image } from '~/components/Image';
import CustomAxios, { baseURL } from '~/config/api';
import useDebounce from '~/hooks/useDebounce';
function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(true);

  const debounced = useDebounce(searchValue, 600);

  useEffect(() => {
    if (!debounced.trim()) {
      setSearchResults([]);
      return;
    }
    getSearchResult();
  }, [debounced]);
  const handleSearchInput = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };
  const getSearchResult = () => {
    CustomAxios.get(`/api/v1/products/search/${debounced}`)
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <HeadlessTippy
      visible={showResult && searchValue.length > 0}
      interactive
      offset={[-15, 10]}
      placement="bottom"
      arrow
      render={(attrs) => (
        <div
          className="w-[calc(100vw_-_20px)] sm:w-full max-h-96 overflow-y-auto  flex-1 max-w-xl bg-white shadow rounded-xl py-2 mx-3 text-xl"
          tabIndex="-1"
          {...attrs}
        >
          {searchResults &&
            searchResults.map((result) => {
              let imageUrl;
              if (result.imageproducts[0]) {
                imageUrl = baseURL + '/' + result.imageproducts[0].url;
              } else {
                imageUrl = '';
              }

              return (
                <Link
                  key={result.id}
                  to={`/product@${encodeURIComponent(CryptoJS.Rabbit.encrypt(`${result.id}`, 'hashUrlProductDetail'))}`}
                >
                  <div className="flex h-full my-3 hover:bg-slate-300/40 p-2 rounded overflow-hidden text-ellipsis">
                    <Image
                      src={imageUrl}
                      alt={result.name}
                      className="w-1/3 h-1/3 sm:w-1/4 sm:h-1/4 rounded object-cover"
                    />
                    <div className="flex flex-col flex-1 mx-2">
                      <div className="text-[16px] sm:text-xl text-orange-300 font-bold">{result.name}</div>
                      <div className="text-[14px] sm:text-[16px]">
                        Type: <strong>{result.category.type}</strong>
                      </div>
                      <div className="text-[14px] sm:text-[16px]">
                        Manufacturer: <strong>{result.manufacturer.manufacturerName}</strong>
                      </div>
                      <div className="font-semibold text-[14px] sm:text-[18px]">
                        {result.salePrice.toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
      onClickOutside={() => setShowResult(false)}
    >
      <div className="relative flex w-full">
        <span className="absolute left-4 top-1/2 text-2xl text-zinc-900/80 -translate-y-1/2">
          <BiSearchAlt />
        </span>
        <input
          value={searchValue}
          onChange={handleSearchInput}
          type="text"
          name="search"
          id="search"
          className="w-full border border-primary border-r-0 pl-12 py-3 pr-3  rounded-md focus:outline-none"
          placeholder="Search by name, price or color"
          onFocus={() => setShowResult(true)}
        />
      </div>
    </HeadlessTippy>
  );
}
export default Search;
