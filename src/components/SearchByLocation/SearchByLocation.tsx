import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { IStateDropdownOption } from '../../common/types';
import { useGetStateListQuery } from '../../Redux/services/api';
import { DEFAULT_NATIONAL_LOCATION } from '../../common/constants';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';
import './search-by-location.scss';
import { currentState } from '../../Redux/Slice/stateSlice';

const initialState = {
  stateNameDisplay: 'National',
  stateCode: '00',
  stateAbbreviation: 'National',
};

const SearchByLocation = ({ setSearchInput, setSearchInfo }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isDisabled, setIsDisabled]: any = useState(true);
  const [stateId, setStateId]: any = useState<any>({
    id: DEFAULT_NATIONAL_LOCATION,
  });
  const stateStatus: any = useGetStateListQuery();
  const persistLocationState = useAppSelector(
    (state) => state?.practiceSlice?.searchInput.state_county_code
  );

  const clearBtnClassNames = classNames(
    'btn',
    'btn-link',
    'clear-button',
    'margin-left-1',
    {
      selected: stateId !== '',
    }
  );

  useEffect(() => {
    const stateCountyCode =
      stateId.id.length === 2 ? `${stateId.id}000` : stateId.id;
    const findStateName = stateStatus?.data?.find((state) => {
      const name = stateId.id === state.stateCode;
      return name;
    })?.stateNameDisplay;

    if (stateId) {
      setSearchInput((prevState) => ({
        ...prevState,
        state_county_code: stateCountyCode,
      }));
      setSearchInfo((prevState) => ({
        ...prevState,
        state: findStateName,
      }));
    } else {
      setSearchInput((prevState) => ({
        ...prevState,
        state_county_code: null,
      }));
    }
  }, [isDisabled, stateId]);

  useEffect(() => {
    if (persistLocationState) {
      setStateId({ id: persistLocationState.slice(0, 2) });
    }
  }, []);

  const handleSelectState = (event: any) => {
    const { value } = event.target;
    setStateId({ id: value });
    setIsDisabled(false);
    if (value) {
      const selectedState =
        value &&
        stateStatus.isSuccess &&
        stateStatus.data &&
        stateStatus.data.find((state: any) => {
          return state.stateCode === value;
        });
      dispatch(currentState(selectedState));
    } else {
      setStateId({ id: DEFAULT_NATIONAL_LOCATION });
      dispatch(currentState(initialState));
    }
  };

  const handleClearLocation = () => {
    if (stateId) {
      setStateId({ id: DEFAULT_NATIONAL_LOCATION });
      dispatch(currentState(initialState));
    }
  };

  return (
    <div className='search-by-location-section' data-testid='location-search'>
      <div className='search-labels'>
        <label className='usa-label location-search-header'>
          {t('location-search.search-by-location')}
        </label>
        <button
          className={clearBtnClassNames}
          type='button'
          onClick={handleClearLocation}
        >
          {t('actions.clear')}
        </button>
      </div>
      <div className='side-by-side'>
        <div className='desktop:grid-col-4'>
          <label htmlFor='stateValue'>
            {t('location-search.labels.select-state')}
          </label>
          <select
            data-testid='select'
            className='usa-select'
            id='stateValue'
            name='selectedStateId'
            onChange={handleSelectState}
            value={stateId.id}
          >
            <option value=''>{t('location-search.national')}</option>
            {stateStatus.isSuccess &&
              stateStatus.data &&
              stateStatus.data.map((state: IStateDropdownOption) => {
                return (
                  <option key={state.stateCode} value={state.stateCode}>
                    {state.stateNameDisplay}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchByLocation;
