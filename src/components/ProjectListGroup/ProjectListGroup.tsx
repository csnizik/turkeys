import { useState } from 'react';
import { useParams } from 'react-router-dom';
import classnames from 'classnames';
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import ProjectListItem from './ProjectListItem';
import { projectTabs } from './constants';
import './project-list-group.scss';
import Pagination from '../Pagination';
import Spinner from '../Spinner/Spinner';
import { useAppSelector } from '../../Redux/hooks/hooks';
import {
  usePostLandscapeInitiativesQuery,
  usePostProjectSearchDataQuery,
} from '../../Redux/services/api';
import ExceptionMessage from '../ExceptionMessage/ExceptionMessage';
import { ISearchData } from '../../common/types';

interface IProjectListProps {
  isMapDisplayed: boolean;
  selectedStateName?: string;
  noListDots?: boolean;
}

const ProjectListGroup = ({
  isMapDisplayed,
  selectedStateName,
  noListDots,
}: IProjectListProps) => {
  const stateInfo = useAppSelector((state) => state?.stateSlice);
  const practiceInfo = useAppSelector(
    (state) => state?.practiceSlice?.searchInput
  );

  const { category, individual }: any = useParams();

  let inputdata: ISearchData = {
    state_county_code: stateInfo?.stateCode || null,
    practice_category_id: Number(category),
    practice_id: Number(individual),
  };

  if (window.location.pathname.includes('/search-results')) {
    inputdata = practiceInfo;
  }

  if (
    inputdata &&
    (inputdata?.state_county_code === '00' ||
      inputdata?.state_county_code === '00000')
  ) {
    inputdata = { ...inputdata };
    delete inputdata.state_county_code;
  }

  if (window.location.pathname.includes('/ProjectsAndInitiatives/')) {
    delete inputdata.practice_category_id;
    delete inputdata.practice_id;
  }

  const {
    data: projectsList,
    error: perror,
    isLoading: pisLoading,
    isSuccess: pisSuccess,
    isError: pisError,
  } = usePostProjectSearchDataQuery(inputdata);

  let { data: initiativesList } = usePostLandscapeInitiativesQuery(inputdata);
  initiativesList = initiativesList?.filter((initiative: any) => {
    return !initiative.lciParentId;
  });

  const [activeTab, setActiveTab] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);
  const [currentIPage, setCurrentIPage] = useState(1);

  const grantsLength = projectsList?.length;
  const initiativesLength = initiativesList?.length;
  let exceptionStateName = stateInfo?.stateNameDisplay || selectedStateName;
  if (exceptionStateName === null || exceptionStateName === undefined)
    exceptionStateName = 'The National';

  const toggleProjectsTab = (tab: number) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = projectsList?.slice(indexOfFirstCard, indexOfLastCard);
  let indexOfLastPage = -1;
  if (projectsList) {
    indexOfLastPage = Math.ceil(projectsList.length / cardsPerPage);
  }

  const indexOfLastICard = currentIPage * cardsPerPage;
  const indexOfFirstICard = indexOfLastICard - cardsPerPage;
  const currentICards = initiativesList?.slice(
    indexOfFirstICard,
    indexOfLastICard
  );
  let indexOfLastIPage = -1;
  if (initiativesList) {
    indexOfLastIPage = Math.ceil(initiativesList.length / cardsPerPage);
  }
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= indexOfLastPage)
      setCurrentPage(pageNumber);
  };
  const iPaginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= indexOfLastPage)
      setCurrentIPage(pageNumber);
  };
  const renderProjectTypeTabs = () => {
    const getTitle = (tab: any) => {
      if (tab.id === 1) {
        return `${tab.tabTitle} (${grantsLength})`;
      }
      if (tab.id === 2) {
        return `${tab.tabTitle} (${initiativesLength})`;
      }
      return tab.tabTitle;
    };
    return (
      <Nav className='nav-fpac' data-testid='project-and-initiative-tabs'>
        {projectTabs.map((tab: any) => {
          const tabID = tab.id;
          return (
            <NavItem key={tabID}>
              <NavLink
                className={classnames({ active: activeTab === tab.id })}
                onClick={() => {
                  toggleProjectsTab(tab.id);
                }}
                tabIndex={0}
              >
                {getTitle(tab)}
              </NavLink>
            </NavItem>
          );
        })}
      </Nav>
    );
  };
  return (
    <div
      className='projects-list-group'
      data-testid='projects-list-group'
      id='ProjectsInitiatives'
    >
      {!isMapDisplayed && renderProjectTypeTabs()}
      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          {isMapDisplayed ? (
            <>
              {grantsLength !== 0 ? (
                <Pagination
                  cards={grantsLength}
                  cardsPerPage={cardsPerPage}
                  paginate={paginate}
                  currentPage={currentPage}
                  indexOfLastPage={indexOfLastPage}
                  indexOfFirstCard={indexOfFirstCard}
                  indexOfLastCard={indexOfLastCard}
                  selectedStateName={stateInfo?.stateNameDisplay}
                  mapComponent={true}
                />
              ) : (
                <div className='margin-top-30'>
                  <ExceptionMessage
                    exceptionTitle={`${exceptionStateName} has no Conservation Innovation Grant data available at this time.`}
                    exceptionMessage=''
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {grantsLength !== 0 ? (
                <>
                  <Pagination
                    cards={grantsLength}
                    cardsPerPage={cardsPerPage}
                    paginate={paginate}
                    currentPage={currentPage}
                    indexOfLastPage={indexOfLastPage}
                    indexOfFirstCard={indexOfFirstCard}
                    indexOfLastCard={indexOfLastCard}
                  />
                </>
              ) : (
                <div className='margin-top-30 padding-top-3'>
                  <ExceptionMessage
                    exceptionTitle='No related Conservation Innovation Grant data are available at this time.'
                    exceptionMessage=''
                  />
                </div>
              )}
            </>
          )}

          <Row>
            <Col sm='12' className='p-3'>
              {pisLoading && <Spinner />}
              {pisError && perror}
              {pisSuccess && grantsLength ? (
                <ul
                  className={
                    noListDots
                      ? 'list-group projects-data no-dots'
                      : 'list-group projects-data'
                  }
                >
                  {currentCards?.map((project: any) => {
                    return (
                      <li>
                        <ProjectListItem
                          key={project.projectId}
                          id={project.projectId}
                          description={project.projectDescription}
                          title={project.projectTitle}
                          owner={project.projectOwner}
                          statesInvolved={project.statesInvolved}
                          year={project.awardeeYear}
                          link={project.projectLink}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId={2}>
          {!isMapDisplayed && (
            <>
              {initiativesLength !== 0 ? (
                <>
                  <Pagination
                    cards={initiativesLength}
                    cardsPerPage={cardsPerPage}
                    paginate={iPaginate}
                    currentPage={currentIPage}
                    indexOfLastPage={indexOfLastIPage}
                    indexOfFirstCard={indexOfFirstICard}
                    indexOfLastCard={indexOfLastICard}
                    selectedStateName={stateInfo?.stateNameDisplay}
                  />
                </>
              ) : (
                <div className='margin-top-30 padding-top-3'>
                  <ExceptionMessage
                    exceptionTitle='No related Landscape Conservation Initiative data are available at this time.'
                    exceptionMessage=''
                  />
                </div>
              )}
            </>
          )}
          <Row>
            <Col sm='12' className='p-3'>
              <ul
                className={
                  noListDots
                    ? 'list-group projects-data no-dots'
                    : 'list-group projects-data'
                }
              >
                {currentICards?.map((initiative: any) => {
                  const initiativeID = initiative.initiativeId;
                  return (
                    <li key={initiativeID}>
                      <ProjectListItem
                        id={initiative.lciId}
                        description={initiative.lciDescription}
                        title={initiative.lciName}
                        owner={initiative.initiativeOwner}
                        statesInvolved={initiative.statesInvolved}
                        year={initiative.initiativeYear}
                        link={initiative.lciPageLink}
                      />
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ProjectListGroup;

ProjectListGroup.defaultProps = {
  selectedStateName: '',
  noListDots: false,
};
