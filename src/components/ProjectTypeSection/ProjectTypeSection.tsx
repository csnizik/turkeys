import { useTranslation } from 'react-i18next';
import LandscapeInitiativesCard from '../LandscapeInitiativesCard';
import { NRCS_CONSERVATION_INITIATIVES_URL, nrcsLinkText } from './constants';
import './project-type.scss';
import LandscapeMapContainer from '../LandscapeInitiativeMap/LandscapeMapContainer';
import { useAppSelector } from '../../Redux/hooks/hooks';

interface IProjectTypeProps {
  selectedLandscapeInitiative: number;
  projectType: any;
  landscapeInitiativesData: any;
}

const ProjectTypeSection = ({
  selectedLandscapeInitiative,
  projectType,
  landscapeInitiativesData,
}: IProjectTypeProps) => {
  const { t } = useTranslation();
  const initiativesWithWebMaps =
    (landscapeInitiativesData &&
      landscapeInitiativesData.data &&
      landscapeInitiativesData.data.filter((initiative: any) => {
        return initiative.lciResource;
      })) ||
    [];

  const uiText = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );

  const renderProjectDetails = () => {
    // Conservation Grants
    if (projectType.id === 1) {
      return (
        <div
          className='project-type-details'
          data-testid='project-type-details'
        >
          <p className='margin-top-3'>{projectType.paragraphDescription}</p>
          <p>
            Visit the{' '}
            <a
              aria-label='Conservation Innovation Grants link opens a new tab'
              href='https://cig.sc.egov.usda.gov/'
              target='_blank'
              rel='noreferrer'
            >
              CIG website
            </a>{' '}
            for more information. Use
            <a
              aria-label='Conservation Innovation Grants link opens in a new tab'
              href='/search'
              target='_blank'
              rel='noreferrer'
            >
              &nbsp;advanced filters to search projects.
            </a>
          </p>
        </div>
      );
    }
    // Landscape Conservation Initiatives
    if (projectType.id === 2) {
      const lciParagraphText1 =
        uiText?.piLciHeadingDescription2?.configurationValue;
      const lciParagraphText2 =
        uiText?.piLciHeadingDescription3?.configurationValue;
      if (projectType.id === 2 || selectedLandscapeInitiative > 0) {
        const foundInitiative =
          landscapeInitiativesData?.data &&
          landscapeInitiativesData.data.find((initiative) => {
            return initiative.lciId === selectedLandscapeInitiative;
          });
        const subInitiative =
          landscapeInitiativesData?.data &&
          landscapeInitiativesData.data.filter((parentId: any) => {
            return parentId.lciParentId !== null;
          });
        return (
          <div
            className='landscape-intiatives margin-top-2'
            data-testid='landscape-intiatives-details'
          >
            {/* Webmap only available for 'Landscape Conservation Initiatives',
            'Watersmart' and 'Working Lands for Wildlife' */}
            {selectedLandscapeInitiative === -1 ||
            initiativesWithWebMaps.some(
              (initiative: any) =>
                initiative.lciId === selectedLandscapeInitiative
            ) ? (
              <LandscapeMapContainer
                landscapeInitiativesData={landscapeInitiativesData.data || []}
                selectedLandscapeInitiative={selectedLandscapeInitiative}
              />
            ) : (
              <div className='landscape-img'>
                {foundInitiative?.lciImageLink.includes('.pdf') ? (
                  <object
                    data-testid='pdf-map'
                    className='map'
                    data={foundInitiative?.lciImageLink}
                    // we may need this version that hides the toolbar later
                    // data={`${foundInitiative?.lciImageLink}#toolbar=0&navpanes=0&scrollbar=0`}}
                    type='application/pdf'
                    width='100%'
                    title={foundInitiative?.lciName}
                    aria-label={foundInitiative?.lciName}
                  />
                ) : (
                  <img
                    data-testid='img-map'
                    src={foundInitiative?.lciImageLink}
                    alt={foundInitiative?.lciName}
                  />
                )}
              </div>
            )}
            <a
              aria-label={foundInitiative?.lciPageLinkText || nrcsLinkText}
              href={
                foundInitiative?.lciPageLink ||
                NRCS_CONSERVATION_INITIATIVES_URL
              }
              target='_blank'
              title={foundInitiative?.lciPageLinkText || nrcsLinkText}
              rel='noreferrer'
            >
              {foundInitiative?.lciPageLinkText || nrcsLinkText}{' '}
            </a>
            <i className='fas fa-external-link-alt' />
            <hr className='margin-bottom-2' />
            <div className='landscape-details'>
              {
                /*eslint react/no-array-index-key: 0 */
                selectedLandscapeInitiative > 0 ? (
                  foundInitiative?.lciDescription.map(
                    (paragraphText: any, id: number) => {
                      return <p key={id}>{paragraphText}</p>;
                    }
                  )
                ) : (
                  <>
                    <p>{lciParagraphText1}</p>
                    <p>{lciParagraphText2}</p>
                  </>
                )
              }

              {foundInitiative?.lciId === 10 &&
              selectedLandscapeInitiative > 0 ? (
                <>
                  <h3 className='wlfw-header'>
                    {t('projects-page.wlfw-header')}
                  </h3>
                  {subInitiative?.map((item: any) => (
                    /* eslint-disable */
                    <LandscapeInitiativesCard
                      link={item.lciPageLink}
                      title={item.lciName}
                      description={item.lciDescription}
                    />
                  ))}
                </>
              ) : null}
            </div>
          </div>
        );
      }
    }
    return null;
  };
  const renderPageTitle = () => {
    if (selectedLandscapeInitiative > 0) {
      const foundInitiative = landscapeInitiativesData?.data?.find(
        (initiative) => {
          return initiative.lciId === selectedLandscapeInitiative;
        }
      );
      return <h2 data-testid='initiative-title'>{foundInitiative?.lciName}</h2>;
    }
    return <h2 data-testid='project-type-title'>{projectType.title}</h2>;
  };

  return (
    <div className='project-type-section' data-testid='project-type-overview'>
      {renderPageTitle()}
      {renderProjectDetails()}
    </div>
  );
};

export default ProjectTypeSection;
