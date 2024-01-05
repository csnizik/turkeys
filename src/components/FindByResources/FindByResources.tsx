import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CustomButton from '../CustomButton';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';
import { IResourceConcernList } from '../../common/types';
import './find-by-resource.scss';
import {
  useGetResourcesQuery,
  useGetResourceConcernQuery,
} from '../../Redux/services/api';
import {
  setPracticeCategory,
  setSpecificPractice,
} from '../../Redux/Slice/practiceSlice';
import {
  setResourceConcernCategory,
  setSpecificResourceConcern,
} from '../../Redux/Slice/resourceConcernSlice';

import { baseURL } from '../../common/util/AxiosUtil';

const FindByResources = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [selectedResource, setSelectedResource] = useState(-1);
  const [selectedSubResource, setSelectedSubResource] = useState(-1);
  const [hiddenSelectedResource, setHiddenSelectedResource] = useState(-1);
  const [selectedResourceConcern, setSelectedResourceConcern] = useState<string>('ALL');
  const [selectedResourceConcernName, setSelectedResourceConcernName] = useState<string>('Select resource');

  const handleFindResources = () => {
    dispatch(setResourceConcernCategory(+hiddenSelectedResource));
    dispatch(setSpecificResourceConcern(+selectedSubResource));
    if (+hiddenSelectedResource !== -1 && +selectedSubResource === -1) {
      history.push(`00/ResourceConcerns/${+hiddenSelectedResource}`);
    } else if (+hiddenSelectedResource !== -1 && +selectedSubResource !== -1) {
      history.push(
        `00/ResourceConcerns/${+hiddenSelectedResource}/${+selectedSubResource}`
      );
    } else {
      history.push('00/ResourceConcerns');
    }
    //Google Analytics code for PracticeSearch(hiddenSelectedPractice, selectedSubPractice), needs refactor
    // window.dataLayer.push({ js: new Date() });
    // window.dataLayer.push({
    //   event: 'PracticeSearch',
    //   EventProps: {
    //     SearchPractice: hiddenSelectedPractice,
    //     SearchState: selectedSubPractice,
    //   },
    // });
  };

  const GTMArg = { gtmId: process.env.REACT_APP_Google_Tag || '' };
  TagManager.initialize(GTMArg);

  const resourceCategory = useGetResourcesQuery();
  const subResource = useGetResourceConcernQuery(selectedResource);

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );

  const handleCategoryChange = (e) => {
     // The next three lines are for ANDI accebility tool
    const selectedInd = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedInd];
    const selectedCategory = selectedOption.getAttribute('concern-displayname');
    const resourceVal = e.target.value;
    if (resourceVal !== '') {
      setSelectedResource(resourceVal);
      setHiddenSelectedResource(resourceVal);
      setSelectedResourceConcern(selectedCategory);
    }
    setSelectedSubResource(-1);
    dispatch(setSpecificResourceConcern(-1));
  };
  const findP = (id: number) => {
    axios
      .get(`${baseURL}resourceConcern/individual/concern/${id}`)
      .then(function (response) {
        setHiddenSelectedResource(response?.data?.[0]?.rcSwapaCategoryId);
        console.log(response);
      }
      )

  };
  useEffect(() => {
    setSelectedResource(-1);
    setSelectedSubResource(-1);
    dispatch(setPracticeCategory(-1));
    dispatch(setSpecificPractice(-1));
    dispatch(setResourceConcernCategory(-1));
    dispatch(setSpecificResourceConcern(-1));
  }, []);

  const handleResourceChange = (e) => {
     // The next three lines are for ANDI accebility tool
    const selectedInd = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedInd];
    const selectedCategory = selectedOption.getAttribute('concern-displayname');
    const resourceSubVal = e.target.value;
    setSelectedSubResource(resourceSubVal);
    setSelectedResourceConcernName(selectedCategory);
    if (selectedResource < 0) {
      findP(resourceSubVal);
    }
  };

  return (
    <div>
      {/* section above button */}
      <div className='find-resource-container'>
        {/* left of image */}
        <div className='find-by-resource-select-container'>
          <h2 className='h2-style'>
            {uiText?.homeResourceTitle?.configurationValue}
          </h2>
          <p className='p-style'>
            {uiText?.homeResourceDescription?.configurationValue}
          </p>
          {/* select elments and labels */}
          <div className='resource-select-container'>
            <div>
              <label className='usa-label' htmlFor='rccategoryOptions'>
                {t('search-by-resource-concern-home.first-label-name')}
              </label>
              <select
                className='usa-select'
                id='rccategoryOptions'
                name='categorySelect'
                data-testid='rccategoryOptions'
                aria-required="true"
                value={selectedResource}
                onChange={handleCategoryChange}
                aria-label={`Resource Concern: ${selectedResourceConcern}`}
              >
                <option value={-1}>All Resource Concerns (default)</option>
                {resourceCategory.isSuccess && resourceCategory.data
                  ? resourceCategory.data.map((resource: IResourceConcernList) => {
                      return (
                        <option
                          key={resource.resourceConcernId}
                          value={resource.resourceConcernId}
                          data-concern-displayname={resource.resourceConcernName}
                        >
                          {resource.resourceConcernName}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <div>
              <label className='usa-label' htmlFor='resourceOptions'>
                {t('search-by-resource-concern-home.second-label-name')}
              </label>
              <select
                className='usa-select'
                id='resourceOptions'
                name='resourceSelect'
                data-testid='resourceOptions'
                aria-required="true"
                value={selectedSubResource}
                onChange={handleResourceChange}
                aria-label={`Selected Rescource Concern: ${selectedResourceConcernName}`}
              >
                <option value={-1}>- Select resource concern -</option>
                {subResource.isSuccess && subResource.data
                  ? subResource.data.map((item: IResourceConcernList) => {
                      return (
                        <option key={item.resourceConcernId} value={item.resourceConcernId} data-concern-displayname={item.resourceConcernName}>
                          {item.resourceConcernName}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
          </div>
          {/* select elments and labels */}
          <CustomButton onClick={handleFindResources}>
            {t('find-by-resource.find-resources')}
          </CustomButton>
        </div>

        {/* left of image */}
        <div className='resource-image'>
          <img src='images/resource-search-image.png' alt='Man and Woman looking at construction field' />
        </div>
      </div>
      {/* section above button */}
    </div>
  );
};

export default FindByResources;
