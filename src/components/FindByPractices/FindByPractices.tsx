import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CustomButton from '../CustomButton';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';
import { IPractice, IPracticeCategory } from '../../common/types';
import './find-by-practice.scss';
import {
  useGetPracticeCategoryQuery,
  useGetPracticeQuery,
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

const homePagePracticeImage: string =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5B-LQ-QdFXKeJgU9W0wxxffcnPg3FS8ox4Q&usqp=CAU';

const FindByPractices = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [selectedPractice, setSelectedPractice] = useState(-1);
  const [selectedSubPractice, setSelectedSubPractice] = useState(-1);
  const [hiddenSelectedPractice, setHiddenSelectedPractice] = useState(-1);
  const [selectedPracticeCategoryName, setSelectedPracticeCategoryName] = useState('All practices(default)');
  const [selectedPracticeDisplayName, setSelectedPracticeDisplayName] = useState('-Select practice-');


  const handleFindPractices = () => {
    dispatch(setPracticeCategory(+hiddenSelectedPractice));
    dispatch(setSpecificPractice(+selectedSubPractice));
    if (+hiddenSelectedPractice !== -1 && +selectedSubPractice === -1) {
      history.push(`00/ConservationPractices/${+hiddenSelectedPractice}`);
    } else if (+hiddenSelectedPractice !== -1 && +selectedSubPractice !== -1) {
      history.push(
        `00/ConservationPractices/${+hiddenSelectedPractice}/${+selectedSubPractice}`
      );
    } else {
      history.push('00/ConservationPractices');
    }
    //Google Analytics code for PracticeSearch(hiddenSelectedPractice, selectedSubPractice)
    window.dataLayer.push({ js: new Date() });
    window.dataLayer.push({
      event: 'PracticeSearch',
      EventProps: {
        SearchPractice: hiddenSelectedPractice,
        SearchState: selectedSubPractice,
      },
    });
  };

  const GTMArg = { gtmId: process.env.REACT_APP_Google_Tag || '' };
  TagManager.initialize(GTMArg);

  const practiceCategory = useGetPracticeCategoryQuery();
  const subPractice = useGetPracticeQuery(selectedPractice);

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );

  const handleCategoryChange = (e) => {
    // The next three lines are for ANDI accebility tool
    const selectedInd = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedInd];
    const selectedPract = selectedOption.getAttribute('practice-category-displayname');
    const practiceVal = e.target.value;
    if (practiceVal !== '') {
      setSelectedPracticeCategoryName(selectedPract);
      setSelectedPractice(practiceVal);
      setHiddenSelectedPractice(practiceVal);
    }
    setSelectedSubPractice(-1);
    dispatch(setSpecificPractice(-1));
  };
  const findP = (id: number) => {
    axios
      .post(`${baseURL}practiceSearch`, {
        practice_id: id,
        state_county_code: '00000',
      })
      .then((response) =>
        setHiddenSelectedPractice(response?.data?.[0]?.practiceCategoryId)
      );
  };
  useEffect(() => {
    setSelectedPractice(-1);
    setSelectedSubPractice(-1);
    dispatch(setPracticeCategory(-1));
    dispatch(setSpecificPractice(-1));
    dispatch(setResourceConcernCategory(-1));
    dispatch(setSpecificResourceConcern(-1));
  }, []);

  const handlePracticeChange = (e) => {
    const practiceSubVal = e.target.value;
    setSelectedSubPractice(practiceSubVal);
    if (selectedPractice < 0) {
      findP(practiceSubVal);
    }
    // For ANDI Tool
    const selectedInd = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedInd];
    const selectedPract = selectedOption.getAttribute('practice-displayname');
    setSelectedPracticeDisplayName(selectedPract);
  };

  return (
    <div>
      {/* section above button */}
      <div className='find-practice-container'>
        {/* left of image */}
        <div className='practice-image'>
          <img src={homePagePracticeImage} alt='Soil' />
        </div>
        <div className='find-by-practice-select-container'>
          <h2 className='h2-style'>
            {uiText?.homePracticeTitle?.configurationValue}
          </h2>
          <p className='p-style'>
            {uiText?.homePracticeDescription?.configurationValue}
          </p>
          {/* select elments and labels */}
          <div className='practice-select-container'>
            <div>
              <label className='usa-label' htmlFor='categoryOptions'>
                {t('search-by-conservation-practice.first-label-name')}
              </label>
              <select
                className='usa-select'
                id='categoryOptions'
                name='categorySelect'
                data-testid='categoryOptions'
                aria-required="true"
                value={selectedPractice}
                onChange={handleCategoryChange}
                aria-label={`Selected practice category: ${selectedPracticeCategoryName}`}
              >
                <option value={-1}>All practices (default)</option>
                {practiceCategory.isSuccess && practiceCategory.data
                  ? practiceCategory.data.map((practice: IPracticeCategory) => {
                      return (
                        <option
                          key={practice.practiceCategoryId}
                          value={practice.practiceCategoryId}
                          data-practice-category-displayname={practice.practiceCategoryName}
                        >
                          {practice.practiceCategoryName}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
            <div>
              <label className='usa-label' htmlFor='practiceOptions'>
                {t('search-by-conservation-practice.second-label-name')}
              </label>
              <select
                className='usa-select'
                id='practiceOptions'
                name='practiceSelect'
                data-testid='practiceOptions'
                aria-required = "true"
                value={selectedSubPractice}
                onChange={handlePracticeChange}
                aria-label={`Selected practice: ${selectedPracticeDisplayName}`}
              >
                <option value={-1}>- Select practice -</option>
                {subPractice.isSuccess && subPractice.data
                  ? subPractice.data.map((item: IPractice) => {
                      return (
                        <option key={item.practiceId} value={item.practiceId} data-practice-displayname={item.practiceName}>
                          {item.practiceName}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
          </div>
          {/* select elments and labels */}
          <CustomButton onClick={handleFindPractices}>
            {t('find-by-practice.find-practices')}
          </CustomButton>
        </div>

        {/* left of image */}

      </div>
      {/* section above button */}
    </div>
  );
};

export default FindByPractices;
