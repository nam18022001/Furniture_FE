import Tippy from '@tippyjs/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { RiArrowRightSLine, RiFilterOffFill } from 'react-icons/ri';

import { Wrapper } from '~/components/SideBarContentWrapper';
import CustomAxios from '~/config/api';
import { FilterContext } from '~/contexts/FilterContextProvider';
import { clearFilter, setCategory, setColor, setManufacturer } from '~/reducers/filterReducer';

function SideBar({ menu, setMenu }) {
  const [stateFilter, dispatchFilter] = useContext(FilterContext);

  const [categories, setCategories] = useState([]);

  const [manufacturers, setManufacturers] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [showSubCategory, setShowSubCategory] = useState({ parent: -1, subCategories: [] });

  // const [color, setColor] = useState('');

  const getCategoriesAll = async () => {
    const res = await CustomAxios.get('/api/v1/categories/all', {});
    setCategories(res.data);
  };

  const getSubCategoriesByParentCategoryId = async (parentCategoryId) => {
    const result = await CustomAxios.get(`/api/v1/categories/parent/${parentCategoryId}`);
    return result.data;
  };

  const getManufacturersAll = async () => {
    const res = await CustomAxios.get('/api/v1/manufacturers/all');

    setManufacturers(res.data);
  };

  const getAllColors = async () => {
    const res = await CustomAxios.get('/api/v1/products/all-colors');
    setAllColors(res.data);
  };

  useEffect(() => {
    getCategoriesAll();
    getManufacturersAll();
    getAllColors();
    // getSubCategoriesByParentCategoryId();
    // eslint-disable-next-line
  }, []);

  const handleSubcategory = async (id) => {
    if (showSubCategory.parent === id) {
      setShowSubCategory({ parent: -1, subCategories: [] });
    } else {
      setShowSubCategory({ parent: id, subCategories: await getSubCategoriesByParentCategoryId(id) });
    }
  };
  return (
    <Fragment>
      <div
        className={`${
          menu ? 'top-0 left-0 z-[99] bg-white max-h-[100vh]' : ' -left-full'
        } absolute lg:relative lg:block lg:left-0 lg:col-span-1 px-4 pb-6  rounded overflow-y-scroll transition-all duration-500 `}
      >
        <div className="divide-y divide-gray-200 space-y-5">
          <div className="w-full h-6 flex items-center my-3 px-2">
            <div className="flex-1 flex justify-end items-center">
              {(stateFilter.categoryId !== 0) | (stateFilter.manufacturerId !== 0) | (stateFilter.color !== '') ? (
                <Tippy content="Clear filter" placement="right">
                  <div
                    onClick={() => dispatchFilter(clearFilter())}
                    className="flex-[0.1]  p-1 rounded-full cursor-pointer flex justify-center items-center text-slate-200 bg-slate-500 hover:bg-slate-600 hover:text-white"
                  >
                    <RiFilterOffFill />
                  </div>
                </Tippy>
              ) : (
                <></>
              )}
            </div>

            <IoMdClose
              className="lg:hidden w-[30px] h-[30px] text-red-500 ml-[10px] rounded-md border !border-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
              onClick={() => setMenu(false)}
            />
          </div>
          <Wrapper title={'CATEGORIES'} className="m-0 text-[18px]">
            <div className="space-y-2 ">
              {categories.map((category) => {
                return (
                  !category.categoryId && (
                    <div
                      key={category.id}
                      className={`${showSubCategory.parent === category.id ? 'bg-slate-100' : ''}`}
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer px-3 py-[2px] hover:bg-slate-300"
                        onClick={() => handleSubcategory(category.id)}
                      >
                        <div
                          className="flex items-center cursor-pointer"
                          // onClick={() => dispatchFilter(setCategory(category.id))}
                        >
                          <input
                            type="radio"
                            name="cat-1"
                            id={`cat-${category.id}`}
                            className="text-primary focus:ring-0 rounded-sm hidden"
                            checked={stateFilter.categoryId === category.id ? true : false}
                            readOnly
                          />
                          <div htmlFor={`cat-${category.id}`} className="text-gray-600 cursor-pointer font-medium">
                            {category.type}
                          </div>
                        </div>
                        <div
                          className={`${
                            showSubCategory.parent === category.id ? 'rotate-90' : 'rotate-0'
                          } transition-all `}
                        >
                          <RiArrowRightSLine />
                        </div>
                      </div>
                      <div
                        className={`${
                          showSubCategory.parent === category.id ? 'scale-100' : 'hidden'
                        } transition-transform px-3 py-[2px] text-[16px]`}
                      >
                        {showSubCategory.subCategories.length > 0 &&
                          showSubCategory.subCategories.map((data, index) => (
                            <div
                              key={index}
                              className="w-full py-[1px] flex justify-between items-center cursor-pointer"
                            >
                              <label htmlFor={data.type} className="flex-1 cursor-pointer">
                                {data.type}
                              </label>
                              <input
                                id={data.type}
                                type="checkbox"
                                onChange={(e) =>
                                  e.currentTarget.checked
                                    ? dispatchFilter(setCategory(data.id))
                                    : dispatchFilter(setCategory(0))
                                }
                                checked={stateFilter.categoryId === data.id ? true : false}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </Wrapper>

          <Wrapper className="pt-4 text-[18px]" title={'Manufacturers'}>
            <div className="space-y-2">
              {manufacturers.map((manufacturer, index) => (
                <div className="flex items-center cursor-pointer" key={manufacturer.id}>
                  <input
                    type="checkbox"
                    name="brand-1"
                    id={`brand-${manufacturer.id}`}
                    className="text-primary focus:ring-0 rounded-xl cursor-pointer"
                    checked={stateFilter.manufacturerId === manufacturer.id ? true : false}
                    onChange={(e) =>
                      e.currentTarget.checked
                        ? dispatchFilter(setManufacturer(manufacturer.id))
                        : dispatchFilter(setManufacturer(0))
                    }
                  />
                  <label htmlFor={`brand-${manufacturer.id}`} className="text-gray-600 ml-3 cursor-pointer">
                    {manufacturer.manufacturerName}
                  </label>
                </div>
              ))}
            </div>
          </Wrapper>

          <Wrapper className="pt-4" title={'Price'}>
            <div className="mt-4 flex items-center">
              <input
                type="number"
                name="min"
                id="min"
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="min"
                defaultValue={0}
              />
              <span className="mx-3 text-gray-500">-</span>
              <input
                type="number"
                name="max"
                id="max"
                className="w-full border-gray-300 focus:border-primary rounded focus:ring-0 px-3 py-1 text-gray-600 shadow-sm"
                placeholder="max"
                defaultValue={0}
              />
            </div>
          </Wrapper>

          <Wrapper className="pt-4" title={'Color'}>
            <div className="flex items-center gap-2">
              {allColors.map((color, index) => (
                <div key={index} className="color-selector">
                  <input
                    value={color}
                    type="checkbox"
                    name="color"
                    id={`color-${color}`}
                    className="hidden"
                    onChange={(e) =>
                      e.currentTarget.checked ? dispatchFilter(setColor(color)) : dispatchFilter(setColor(''))
                    }
                    checked={stateFilter.color === color ? true : false}
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className={`border ${
                      stateFilter.color === color ? 'rounded-full shadow-xl' : ' rounded-sm shadow-sm '
                    } h-6 w-6  cursor-pointer  block border-white shadow-slate-900`}
                    style={{ backgroundColor: color }}
                  ></label>
                </div>
              ))}
            </div>
          </Wrapper>
        </div>
      </div>
    </Fragment>
  );
}

export default SideBar;
