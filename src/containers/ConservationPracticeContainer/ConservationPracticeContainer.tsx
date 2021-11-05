import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useGetStateListQuery,
  usePostProjectSearchDataQuery,
  usePostSearchDataQuery,
} from '../../Redux/services/api';
import ConservationPracticeLandingScreen from '../../components/ConservationPracticeLandingScreen';
import IndividualPracticeContainer from './IndividualPracticeContainer';
import PracticeBreadcrumbs from '../../components/PracticeBreadcrumbs';
import PracticeCategoryContainer from './PracticeCategoryContainer';
import PracticeCard from '../../components/PracticeCard';
import ReportPreviewCreator from '../../components/ReportPreviewCreator';
import './conservation-practice-container.scss';
import {
  disablePdfGenState,
  enablePdfGenState,
} from '../../Redux/Slice/pdfGenSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';
import {
  setPracticeCategory,
  setSpecificPractice,
} from '../../Redux/Slice/practiceSlice';
import { currentState } from '../../Redux/Slice/stateSlice';
import ProjectListGroup from '../../components/ProjectListGroup';

const defaultPracticeViews = {
  allPractices: false,
  practiceCategories: false,
  individualPractice: false,
};

const ConservationPracticeContainer = ({
  currentSpecificPractice,
  currentPracticeCategoryId,
  selectedStateCode,
}: any) => {
  const { t } = useTranslation();
  const stateInfo = useAppSelector((state: any) => state?.stateSlice);
  const [practiceViewType, setPracticeViewType] =
    useState(defaultPracticeViews);
  const [openModal, setOpenModal] = useState(false);
  const [cleanModal, setCleanModal] = useState(false);
  const stateStatus: any = useGetStateListQuery();
  const dispatch = useAppDispatch();
  const location: any = useLocation();

  const sharedState = location?.state?.detail;

  const selectedStateValue = window.localStorage.getItem('StateId');
  if (window.localStorage.getItem('StateId')) {
    const selectedState =
      selectedStateValue &&
      stateStatus.isSuccess &&
      stateStatus.data &&
      stateStatus.data.find((state: any) => {
        return state.stateCode === selectedStateValue;
      });
    dispatch(currentState(selectedState));
  }

  let searchInputData = {
    practice_id: currentSpecificPractice,
    state_county_code: selectedStateValue?.toString(),
    practice_category_id: currentPracticeCategoryId,
  };

  if (
    searchInputData.state_county_code === '00' ||
    searchInputData.state_county_code === '00000'
  ) {
    searchInputData = { ...searchInputData };
    delete searchInputData.state_county_code;
  }

  const {
    data: pdata,
    error: perror,
    isLoading: pisLoading,
    isSuccess: pisSuccess,
    isError: pisError,
  } = usePostProjectSearchDataQuery(searchInputData);

  const { data, isSuccess } = usePostSearchDataQuery({
    practice_id: sharedState,
  });
  const currentPracticeCategory: any =
    isSuccess &&
    data &&
    currentPracticeCategoryId >= 0 &&
    data.find(
      (practice: any) =>
        practice.practiceCategoryId === currentPracticeCategoryId
    );

  const currentPractice =
    currentPracticeCategory &&
    currentPracticeCategory.practices.find(
      (practice: any) => practice.practiceId === currentSpecificPractice
    );
  const handleCreateReport = () => {
    if (openModal) {
      setOpenModal(false);
      dispatch(disablePdfGenState());
      setCleanModal((pre) => !pre);
    } else {
      setOpenModal(true);
      dispatch(enablePdfGenState());
    }
  };

  const practiceId = location.search.split('=').pop();

  const practiceCategoryId = location.search.substring(
    location.search.indexOf('=') + 1,
    location.search.lastIndexOf('?')
  );

  useEffect(() => {
    if (currentPracticeCategoryId < 0 && currentSpecificPractice < 0) {
      setPracticeViewType({ ...defaultPracticeViews, allPractices: true });
      if (practiceCategoryId && practiceId) {
        dispatch(setPracticeCategory(Number(practiceCategoryId)));
        dispatch(setSpecificPractice(Number(practiceId)));
        setPracticeViewType({ ...practiceViewType, individualPractice: true });
      }
    } else if (currentPracticeCategoryId >= 0 && currentSpecificPractice < 0) {
      //Temporary Fix for associated practies
      window.localStorage.setItem(
        'PracticeCategoryId',
        currentPracticeCategoryId
      );
      setPracticeViewType({ ...practiceViewType, practiceCategories: true });
    } else if (currentSpecificPractice >= 0) {
      setPracticeViewType({ ...practiceViewType, individualPractice: true });
    }
    //Temporary Fix for associated practies
    if (window.localStorage.getItem('PracticeId')) {
      const practiceNum = Number(window.localStorage.getItem('PracticeId'));
      const practiceCategoryNum = Number(
        window.localStorage.getItem('PracticeCategoryId')
      );
      dispatch(setSpecificPractice(practiceNum));
      dispatch(setPracticeCategory(practiceCategoryNum));
      setPracticeViewType({ ...practiceViewType, individualPractice: true });
    }
  }, [currentPracticeCategoryId, currentSpecificPractice]);

  const renderPracticeContainerContent = (viewType: string) => {
    if (viewType === 'allPractices') {
      return (
        <ConservationPracticeLandingScreen
          stateCode={selectedStateCode}
          setPracticeViewType={setPracticeViewType}
        />
      );
    }
    if (viewType === 'practiceCategories') {
      // TODO: Return container / components for Practice Categories here
      return (
        <>
          <PracticeCategoryContainer
            currentPracticeCategory={currentPracticeCategory}
          />
          <PracticeCard setPracticeViewType={setPracticeViewType} />
        </>
      );
    }
    if (viewType === 'individualPractice') {
      return (
        <>
          <IndividualPracticeContainer />
          <div className='title-section'>
            <div className='top-title'>
              <h4 className='project-title'>
                {stateInfo?.stateNameDisplay || 'U.S.'}{' '}
                {t('associated-projects-initiatives.title')}{' '}
                {currentPractice.practiceName}
              </h4>
            </div>
            <p className='intro-desc'>
              {t('associated-projects-initiatives.description')}
            </p>
          </div>
          <ProjectListGroup
            error={perror}
            isError={pisError}
            isLoading={pisLoading}
            isSuccess={pisSuccess}
            isMapDisplayed={false}
            projectsList={pdata}
          />
        </>
      );
    }
    return null;
  };

  const viewTypeList = Object.keys(practiceViewType);
  const currentViewType =
    viewTypeList.find((view: string) => {
      return practiceViewType[view];
    }) || 'allPractices';

  return (
    <>
      <PracticeBreadcrumbs
        currentView={practiceViewType}
        setPracticeViewType={setPracticeViewType}
        currentPracticeCategory={currentPracticeCategory}
        currentSpecificPractice={currentSpecificPractice}
        handleCreateReport={handleCreateReport}
      />

      <div className='overlay'>
        <ReportPreviewCreator
          openModal={openModal}
          handleCreateReport={handleCreateReport}
          cleanModal={cleanModal}
        />
      </div>
      {renderPracticeContainerContent(currentViewType)}
    </>
  );
};

export default ConservationPracticeContainer;
