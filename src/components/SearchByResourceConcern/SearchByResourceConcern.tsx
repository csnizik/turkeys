import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRequest } from '../../common/util/AxiosUtil';
import './search-by-resource-concern.scss';
import { disableState, enableState } from '../../Redux/Slice/disableSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';

const SearchByResourceConcern = () => {
  const dispatchRequest = useAppDispatch();
  const status = useAppSelector((state) => state.disableSlice.disablePractice);
  const { t } = useTranslation();
  const [resourceConcerns, setResourceConcerns] = useState<any[]>([]);
  const [resourceConcernsSubgroups, setResourceConcernsSubgroups] = useState<
    any[]
  >([]);
  const [selectedResourceCategory, setSelectedResourceCategory] =
    useState<string>('');
  const [selectedResourceSubgroup, setSelectedResourceSubgroup] =
    useState<string>('');

  const getResourceConcerns = async () => {
    try {
      const response: any = await getRequest('/resourceConcern/concern');
      setResourceConcerns(response.data.length > 0 ? response.data : []);
    } catch (error) {
      throw new Error('Resource Concern Request Error');
    }
  };

  const getResourceConcernsSubgroups = async (swapaCategory) => {
    try {
      const response: any = await getRequest(
        `/resourceConcern/concern/category/${swapaCategory}`
      );
      setResourceConcernsSubgroups(
        response.data.length > 0 ? response.data : []
      );
    } catch (error) {
      throw new Error('Resource Concern Subgroup Request Error');
    }
  };

  useEffect(() => {
    getResourceConcerns();
  }, []);

  const handleChange = (e) => {
    const { value }: any = e.target;
    setSelectedResourceCategory(value);
    if (e.target.value !== '') {
      getResourceConcernsSubgroups(value);
      dispatchRequest(disableState());
    } else {
      setResourceConcernsSubgroups([]);
      dispatchRequest(enableState());
    }
  };

  const handleSubgroupChange = (e) => {
    setSelectedResourceSubgroup(e.target.value);
  };

  return (
    <div className='resource-box-wrapper'>
      <div className='search-by-resource-section'>
        <label
          className='usa-label resource-search-header'
          aria-labelledby='resourceConcernCategoryValue resourceConcernValue'
        >
          {t('search-by-resource-concern.heading')}
        </label>

        <div className='desktop:grid-col-8'>
          <label
            className='usa-label resource-search-header'
            htmlFor='resourceConcernCategoryValue'
          >
            <p>{t('search-by-resource-concern.first-label-name')}</p>
          </label>
          <select
            className='usa-select'
            id='resourceConcernCategoryValue'
            name='resourceConcernCategorySelect'
            disabled={status}
            onChange={handleChange}
            value={selectedResourceCategory}
          >
            <option value=''>All resource concerns (default)</option>
            {resourceConcerns.length
              ? resourceConcerns.map((item: any) => {
                  return (
                    <option
                      key={item.resourceConcernId}
                      value={item.resourceConcernId}
                    >
                      {item.resourceConcernName}
                    </option>
                  );
                })
              : null}
          </select>
        </div>

        <div className='desktop:grid-col-8'>
          <label
            className='usa-label resource-search-header'
            htmlFor='resourceConcernValue'
          >
            <p>{t('search-by-resource-concern.second-label-name')}</p>
          </label>
          <select
            className='usa-select'
            id='resourceConcernValue'
            name='resourceConcernSelect'
            disabled={selectedResourceCategory === ''}
            onChange={handleSubgroupChange}
            value={selectedResourceSubgroup}
          >
            <option value=''>- Select resource concern -</option>
            {resourceConcernsSubgroups.length
              ? resourceConcernsSubgroups.map((item: any) => {
                  return (
                    <option
                      key={item.resourceConcernId}
                      value={item.resourceConcernId}
                    >
                      {item.resourceConcernName}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchByResourceConcern;
