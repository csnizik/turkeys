import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from '../../common/util/AxiosUtil';
import {
  IPractice,
  IResourceConcernList,
  ICountyList,
  IStateDropdownOption,
  ILandUseOption,
  IPracticeCategory,
  ISearchData,
  IPracticeVideo,
  IConservationPractice,
  IRCCategory,
  IRCRequestBody,
  IAssociatedPracticeList,
  IIndividualResourceConcern,
  ICPPEScore,
  ICPPEPractice,
} from '../../common/types';

export const fotgApi = createApi({
  reducerPath: 'fotgApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    //Get the specific FOTG State and Practice Folder Link given a state code practice code and URL
    getFotgFolderUrl: builder.query<any, any>({
      query: (fotgInfo) =>
        `${fotgInfo.fotgLink}?stateCode=${fotgInfo.stateCode}&practiceCode=${fotgInfo.practiceCode}`,
    }),
  }),
});
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    //! Resource Concern Get the SWAPA data
    getResources: builder.query<IResourceConcernList[], void>({
      query: () => '/resourceConcern/concern',
    }),
    getNationalOverviewByPractice: builder.query<IConservationPractice, number>(
      {
        query: (practiceId: number) =>
          `/nationalPracticeOverview/${practiceId}`,
      }
    ),
    getStateList: builder.query<IStateDropdownOption[], void>({
      query: () => `/states`,
    }),
    getCountyList: builder.query<ICountyList[], string>({
      query: (stateCode) => `/counties/${stateCode}`,
    }),
    //! Get the Land Use
    getLandUseOptions: builder.query<ILandUseOption[], void>({
      query: () => '/categories',
    }),
    //! Practice Category
    getPracticeCategory: builder.query<IPracticeCategory[], void>({
      query: () => '/practice/categories',
    }),
    //! Practice depending on Category
    getPractice: builder.query<IPractice[], number>({
      query: (id) => `/practice/catagories/practices?id=${id}`,
    }),
    //! Resource Concern depending on SWAPA category
    getResourceConcern: builder.query<IResourceConcernList[], number>({
      query: (swapaCategory) =>
        `/resourceConcern/concern/category/${swapaCategory}`,
    }),
    // Individual Resource Concern Info based on ID
    getIndividualResourceConcern: builder.query<
      [IIndividualResourceConcern],
      any
    >({
      query: (resourceId) =>
        `/resourceConcern/individual/concern/${resourceId}`,
    }),
    // Get the CPPE score for a individual resource concern
    getCPPEScores: builder.query<ICPPEScore[], { resourceId: number }>({
      query: (data) => {
        const { resourceId } = data;
        return `/CPPE/rc/${resourceId}`;
      },
    }),
    // Get the negatively impacted practice resource concerns via practice code
    getNegativeCPPEPractice: builder.query<ICPPEPractice[], string>({
      query: (practiceCode) => `/CPPE/${practiceCode}`,
    }),
    //!Post request for Search
    postSearchData: builder.query<ISearchData[], ISearchData>({
      query: (data) => ({
        url: '/practiceSearch',
        method: 'POST',
        body: data,
      }),
    }),
    //!Post request for Project Search
    postProjectSearchData: builder.query<ISearchData[], ISearchData>({
      query: (data) => ({
        url: '/project/projectSearch',
        method: 'POST',
        body: data,
      }),
    }),
    //!Post request for Landscape Initiatives
    postLandscapeInitiatives: builder.query<ISearchData[], ISearchData>({
      query: (data) => ({
        url: '/landscapeInitiatives',
        method: 'POST',
        body: data,
      }),
    }),
    getPracticeVideoLink: builder.query<IPracticeVideo[], number>({
      query: (practiceId: number) => `/video/${practiceId}`,
    }),
    getRelatedResourceConcernCategory: builder.query<
      IRCCategory,
      IRCRequestBody
    >({
      query: (data) =>
        `/relatedResourceConcernCategory?stateCode=${data.stateCode}&practiceId=${data.practiceId}`,
    }),
    // ! Associated Practices depending on State Code and Practice Id
    getAssociatedPractice: builder.query<
      IAssociatedPracticeList[],
      IRCRequestBody
    >({
      query: (data) =>
        `/practice/associatedPractice?state_code=${data.stateCode}&practice_id=${data.practiceId}`,
    }),
    // Payment Schedule Links depending on state
    getPaymentScheduleLinks: builder.query<any, any>({
      query: (stateCode) => `/payment/link?stateCode=${stateCode}`,
    }),
    // configuration settings
    getConfigurationSettingsStaticText: builder.query<any, any>({
      query: () => `/parameters`,
      transformResponse: (response: any) =>
        response.reduce((acc, curr) => {
          acc[curr.configurationSettingName] = curr;
          return acc;
        }, {}),
    }),
    getConfigurationSettings: builder.query<any, any>({
      query: (fotgId) => `/parameter?key=${fotgId}`,
    }),
  }),
});
export const {
  useGetResourcesQuery,
  useGetResourceConcernQuery,
  useGetPracticeCategoryQuery,
  useGetPracticeQuery,
  usePostSearchDataQuery,
  usePostProjectSearchDataQuery,
  useGetNationalOverviewByPracticeQuery,
  useGetCountyListQuery,
  useGetStateListQuery,
  useGetLandUseOptionsQuery,
  useGetPracticeVideoLinkQuery,
  useGetRelatedResourceConcernCategoryQuery,
  useGetAssociatedPracticeQuery,
  useGetPaymentScheduleLinksQuery,
  usePostLandscapeInitiativesQuery,
  useGetConfigurationSettingsStaticTextQuery,
  useGetConfigurationSettingsQuery,
  useGetIndividualResourceConcernQuery,
  useGetCPPEScoresQuery,
  useGetNegativeCPPEPracticeQuery,
} = api;
export const { useGetFotgFolderUrlQuery } = fotgApi;
