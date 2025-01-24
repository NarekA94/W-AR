import {apiSlice} from '../apiSlice';
import {Category, CategoryProduct} from './types';

export const catalogApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: 'type',
        method: 'GET',
      }),
    }),
    getCategoryProducts: builder.query<
      CategoryProduct[],
      {type: number[]; search?: string}
    >({
      query: data => ({
        url: 'product',
        method: 'GET',
        params: {
          type: data.type,
          search: data.search,
        },
      }),
    }),
    getCategoryProduct: builder.query<CategoryProduct, {id: number}>({
      query: data => ({
        url: `product/${data.id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryProductsQuery,
  useGetCategoryProductQuery,
} = catalogApi;
