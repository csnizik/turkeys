import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setLandUse,
  setPracticeCategory,
  setSearch,
  setSearchInfo,
  setSpecificPractice,
} from '../../Redux/Slice/practiceSlice';
import {
  setLandUse as setLandUseResourceConcern,
  setResourceConcernCategory,
  setSearch as setSearchResourceConcern,
  setSearchInfo as setSearchInfoResourceConcern,
  setSpecificResourceConcern,
} from '../../Redux/Slice/resourceConcernSlice';
import { useAppDispatch } from '../../Redux/hooks/hooks';
import { currentState } from '../../Redux/Slice/stateSlice';
import './gov-banner.scss';
import { initialLandUse } from '../../common/typedconstants.common';
import {
  enablePracticeDropdown,
  enableResourceDropdown,
} from '../../Redux/Slice/disableSlice';

import { useGetConfigurationSettingsStaticTextQuery } from '../../Redux/services/api';
import { setStaticText } from '../../Redux/Slice/staticTextSlice';

const initialState = {
  stateNameDisplay: 'National',
  stateCode: '00',
  stateAbbreviation: 'National',
};

const defaultSearchInput: any = {
  land_use_list: null,
};
const defaultSearchInfo: any = {
  land_use_list: null,
};

const GovernmentBanner = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const uiText = useGetConfigurationSettingsStaticTextQuery(null, {
    pollingInterval: 900000,
  });

  // eslint-disable-next-line
  useEffect(() => {
    if (uiText && uiText?.data != null) {
      dispatch(setStaticText(uiText));
    }
  }, [uiText]);

  const handleNavigateHome = () => {
    window.dispatchEvent(new Event('navigateHome'));
    dispatch(currentState(initialState));

    dispatch(setResourceConcernCategory(-1));
    dispatch(setSpecificResourceConcern(-1));
    dispatch(setLandUseResourceConcern(initialLandUse));
    dispatch(setSearchInfoResourceConcern(defaultSearchInfo));
    dispatch(setSearchResourceConcern(defaultSearchInput));

    dispatch(setPracticeCategory(-1));
    dispatch(setSpecificPractice(-1));
    dispatch(setLandUse(initialLandUse));
    dispatch(setSearchInfo(defaultSearchInfo));
    dispatch(setSearch(defaultSearchInput));

    dispatch(enablePracticeDropdown());
    dispatch(enableResourceDropdown());
    window.localStorage.clear();
  };
  const renderNRCSHeaderSection: Function = () => (
    <div data-testid='gov-banner-header' className='usa-banner-header'>
      <div className='usa-accordion'>
        <div className='usa-banner__header'>
          <div className='usa-banner__inner '>
            <div className='grid-col-auto'>
              <img
                className='flex-align-self-left'
                src='../../../../images/usa-flag-logo.png'
                alt=''
              />
            </div>
            <div className='grid-col-fill tablet:grid-col-auto'>
              {`${t('header.disclaimer')} `}
            </div>
            <div className='grid-col-fill tablet:grid-col-auto'>
              <button
                type='button'
                className='usa-accordion__button usa-banner__button'
                aria-expanded='false'
                aria-controls='gov-banner'
              >
                <span className='usa-banner__button-text'>
                  {' '}
                  {`${t('header.here-how-you-know')}`}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className='usa-banner__content' id='gov-banner' hidden>
          <div className='grid-row grid-gap-lg'>
            <div className='usa-banner__guidance tablet:grid-col-6'>
              <img
                className='usa-banner__icon usa-media-block__img'
                src='../../../../images/icon-dot-gov.svg'
                alt=''
              />
              <div className='usa-media-block__body'>
                <p>
                  <strong>The .gov means it is official.</strong>
                  <br />
                  Federal government websites often end in .gov or .mil. Before
                  sharing sensitive information, make sure you’re on a federal
                  government site.
                </p>
              </div>
            </div>
            <div className='usa-banner__guidance tablet:grid-col-6'>
              <img
                className='usa-banner__icon usa-media-block__img'
                src='../../../../images/icon-https.svg'
                alt=''
              />
              <div className='usa-media-block__body'>
                <p>
                  <strong>The site is secure.</strong>
                  <br />
                  The <strong>https://</strong> ensures that you are connecting
                  to the official website and that any information you provide
                  is encrypted and transmitted securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='usda-header row-flex-start'>
        <Link 
          to='/'
          onClick={handleNavigateHome}>
          <img src='../../../../images/usda_logo_color.png' alt='USDA LOGO' />
        </Link>
        <div className='government-banner'>
        <Link 
          to='/'
          onClick={handleNavigateHome}
          className='usa-link'>
          <h1 className='page-title header-sizing' data-testid='page-title'>
            {t('header.nrcs')}
          </h1>
        </Link>
        <Link
          to='/'
          onClick={handleNavigateHome}
          className='usa-link'>
          <p>{t('header.usda')}</p>
        </Link>
        </div>
      </div>
    </div>
  );

  const renderNavigationSection: Function = () => (
    <div data-testid='gov-banner-nav' className='navigation-bar'>
      <Link
        to='/'
        onClick={handleNavigateHome}>
        <img
          className='nrcsLogo'
          src='../../../../images/nrcs_logo.png'
          alt=''
        />
      </Link>
      <Link
        to='/'
        onClick={handleNavigateHome}
        className='usa-link margin-left-05'
      >
        {t('header.home')}
      </Link>
      {pathname !== '/' && pathname !== '/search' && (
        <Link to='/search' className='usa-link float-right'>
          {t('header.search')}
        </Link>
      )}
    </div>
  );

  return (
    <header>
      {renderNRCSHeaderSection()}
      {renderNavigationSection()}
    </header>
  );
};

export default GovernmentBanner;
