import { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useParams } from 'react-router-dom';
import {
  useGetStateListQuery,
  usePostLandscapeInitiativesQuery,
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
import NextSteps from '../../components/NextSteps/NextSteps';


const defaultPracticeViews = {
  allPractices: false,
  practiceCategories: false,
  individualPractice: false,
};

const GTMArg = { gtmId: process.env.REACT_APP_Google_Tag || '' };
TagManager.initialize(GTMArg);

const ConservationPracticeContainer = ({
  currentSpecificPractice,
  currentPracticeCategoryId,
}: any) => {
  const stateInfo = useAppSelector((state: any) => state?.stateSlice);
  const [practiceViewType, setPracticeViewType] =
    useState(defaultPracticeViews);
  const [openModal, setOpenModal] = useState(false);
  const [cleanModal, setCleanModal] = useState(false);
  const [selectedStateValue] = useState(stateInfo?.stateCode);
  const [projectsInitiativesData, setProjectsInitiativesData]: any = useState(
    []
  );
  const stateStatus: any = useGetStateListQuery();
  const dispatch = useAppDispatch();
  const { category, individual, stateCode, name }: any = useParams();
  const selectedStateCode = stateInfo?.stateCode;

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );

  useEffect(() => {
    //GA code for  currentSpecificPractice & currentPracticeCategoryId ** might duplicate and code for stateC
    window.dataLayer.push({ js: new Date() });
    window.dataLayer.push({
      event: 'PracticeContainer',
      EventProps: {
        SearchPractice: currentSpecificPractice,
        SearchCategory: currentPracticeCategoryId,
        SearchState: selectedStateCode,
      },
    });
  }, [category, individual, stateCode]);

  useEffect(() => {
    //Google Analytics code for PracticeContainerTab() currentSpecificPractice & currentPracticeCategoryId and statecode)
    window.dataLayer.push({ js: new Date() });
    window.dataLayer.push({
      event: 'PracticeContainerTab',
      EventProps: {
        SearchPractice: currentSpecificPractice,
        SearchCategory: currentPracticeCategoryId,
        SearchState: selectedStateCode,
        SearchName: name,
      },
    });
  }, [name]);

  useEffect(() => {
    if (individual && name !== 'ProjectsAndInitiatives') {
      setPracticeViewType({
        ...defaultPracticeViews,
        individualPractice: true,
      });
      dispatch(setPracticeCategory(+category));
      dispatch(setSpecificPractice(+individual));
    } else if (category && name !== 'ProjectsAndInitiatives') {
      setPracticeViewType({
        ...defaultPracticeViews,
        practiceCategories: true,
      });
      dispatch(setPracticeCategory(+category));
      dispatch(setSpecificPractice(-1));
    } else {
      setPracticeViewType({
        ...defaultPracticeViews,
        allPractices: true,
      });
    }
  }, [category, individual]);

  useEffect(() => {
    const selectedState =
      selectedStateValue &&
      stateStatus.isSuccess &&
      stateStatus.data &&
      stateStatus.data.find((state: any) => {
        return state?.stateCode === selectedStateValue;
      });
    if (selectedState) {
      dispatch(currentState(selectedState));
    }
  }, [selectedStateValue]);

  let searchInputData = {
    practice_id: currentSpecificPractice,
    state_county_code: selectedStateCode,
    practice_category_id: currentPracticeCategoryId,
  };

  if (
    searchInputData.state_county_code === '00' ||
    searchInputData.state_county_code === '00000'
  ) {
    searchInputData = { ...searchInputData };
    delete searchInputData.state_county_code;
  }
  const { data: pdata } = usePostProjectSearchDataQuery(searchInputData);
  const { data: ldata } = usePostLandscapeInitiativesQuery(searchInputData);

  const { data, isSuccess } = usePostSearchDataQuery({
    state_county_code: `${stateCode}000`,
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
  useEffect(() => {
    const tempData = [
      { title: 'Conservation Innovation Grants', data: pdata },
      { title: 'Landscape Conservation Initiatives', data: ldata },
    ];
    setProjectsInitiativesData(tempData);
  }, [pdata, ldata]);

  useEffect(() => {
    if (currentPracticeCategoryId < 0 && currentSpecificPractice < 0) {
      setPracticeViewType({ ...defaultPracticeViews, allPractices: true });
    } else if (currentPracticeCategoryId >= 0 && currentSpecificPractice < 0) {
      dispatch(setPracticeCategory(currentPracticeCategoryId));
      setPracticeViewType({
        ...defaultPracticeViews,
        practiceCategories: true,
      });
    } else if (currentSpecificPractice >= 0) {
      setPracticeViewType({
        ...defaultPracticeViews,
        individualPractice: true,
      });
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
          <div className='title-section' data-testid='pratice-title'>
            <div className='top-title'>
              <h4 className='project-title'>
                {stateInfo?.stateNameDisplay === 'National'
                  ? 'National'
                  : stateInfo?.stateNameDisplay}{' '}
                {uiText?.cpDetailHeading5?.configurationValue}{' '}
                {currentPractice?.practiceName}
                {' practice'}
              </h4>
            </div>
            <p className='intro-desc'>
              {uiText?.cpDetailHeadingPiDescription?.configurationValue}
            </p>
          </div>
          <ProjectListGroup isMapDisplayed={false} noListDots={true} />
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

      {openModal ? (
        <div className='overlay'>
          <ReportPreviewCreator
            openModal={openModal}
            handleCreateReport={handleCreateReport}
            cleanModal={cleanModal}
            projectsInitiativesData={projectsInitiativesData}
          />
        </div>
      ) : null}
      {renderPracticeContainerContent(currentViewType)}
      <NextSteps/>
    </>
  );
};

export default ConservationPracticeContainer;
