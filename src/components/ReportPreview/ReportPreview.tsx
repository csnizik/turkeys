import './report-preview.scss';
import { useEffect, useRef } from 'react';
import ConservationPracticeOverview from '../ConservationPracticeOverview';
import ImplementationExtent from '../ImplementationExtent';
import SpecificationsAndTools from '../SpecificationsAndTools';
import ResourceConcernTreated from '../ResourceConcernTreated';
import ProjectListItem from '../ProjectListGroup/ProjectListItem';
import ApplicationImpacts from '../ApplicationImpacts';
import ConservationPracticeVideo from '../ConservationPracticeVideo';

const ReportPreview = ({
  selectedStateName,
  selectedStateCode,
  choiceInputs,
  reportPreviewData,
  practiceId,
  rcRef,
  rcRef2,
  rcTreatedInputs,
  selectedProjInitData,
}: any) => {
  const { data, error, isLoading, isSuccess, isError } = reportPreviewData;
  const mountedRef = useRef(true);
  const renderProjInit = (projInit) => {
    const projInitList = projInit.data.map((item) => {
      return (
        <div
          className='proj-list-item'
          key={item?.[`projectTitle` || `lci_name`]}
        >
          <ProjectListItem
            id={item?.projectId || item?.lci_id}
            description={item?.projectDescription || item?.lci_description}
            title={item?.projectTitle || item?.lci_name}
            owner={item?.projectOwner}
            statesInvolved={item?.statesInvolved}
            year={item?.awardeeYear}
            link={item?.projectLink || item?.lci_page_link}
          />
        </div>
      );
    });
    return (
      <div className='projects-data'>
        <div className='subheader-titlee'>{projInit.title}</div>
        <ul key={projInit.title} className='bullets'>
          {projInitList}
        </ul>
      </div>
    );
  };
  const renderProjInits = (projInit) => {
    const total = projInit.map((pItem) => {
      return renderProjInit(pItem);
    });

    return (
      <div className='proj-inits'>
        <h2 className='bold-header'>
          {`${selectedStateName} ${data?.practiceName} Projects and Initiatives`}
        </h2>
        <p>
          NRCS projects and initiatives on the ground assess the impacts of
          conservation practices, build scientific understanding of those
          impacts and the processes underlying them, explore the potential of
          innovative conservation activities, and coordinate planning efforts at
          larger scales to address resource concerns from a watershed or
          landscape perspective.
        </p>
        {total}
      </div>
    );
  };
  const contentToRender = () => {
    return (
      <div className='preview-scroll'>
        <div id='preview-content'>
          <h3 id='preview-content-header'>
            {data?.practiceName} in{' '}
            {selectedStateName === 'U.S.' ? 'the U.S.' : selectedStateName}
          </h3>
          <div data-testid='conservation-overview'>
            {choiceInputs.input1 && (
              <div>
                <ConservationPracticeOverview
                  data={data}
                  error={error}
                  isSuccess={isSuccess}
                  isError={isError}
                  isLoading={isLoading}
                />
                <ConservationPracticeVideo selectedPracticeId={practiceId} />
              </div>
            )}
          </div>
          <div className={rcTreatedInputs.size < 1 ? 'hidden-content' : ''}>
            <div data-testid='resource-concern-treated'>
              <ResourceConcernTreated
                selectedStateCode={selectedStateCode}
                selectedPracticeId={practiceId}
                rcRef={rcRef}
              />
            </div>
          </div>
          <div data-testid='implementation-extent'>
            {choiceInputs.input2 && (
              <div>
                <ImplementationExtent data={data} isSuccess={isSuccess} />
              </div>
            )}
          </div>
          <div data-testid='spec-tools'>
            {choiceInputs.input3 && (
              <div>
                <SpecificationsAndTools
                  selectedStateCode={selectedStateCode}
                  selectedPracticeId={practiceId}
                  data={data}
                  isSuccess={isSuccess}
                />
              </div>
            )}
          </div>
          <div data-testid='app-impacts'>
            {choiceInputs.input4 && (
              <div>
                <ApplicationImpacts data={data} isSuccess={isSuccess} />
              </div>
            )}
          </div>
          <div data-testid='proj-init'>
            {selectedProjInitData.length > 0 ? (
              <div>{renderProjInits(selectedProjInitData)}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
  // We  need this to render a version for the pdf which can't have scroll bar
  const contentToRenderPdf = () => {
    return (
      <div id='preview-content-pdf'>
        <h3 id='preview-content-header-pdf'>
          {data?.practiceName} in{' '}
          {selectedStateName === 'U.S.' ? 'the U.S.' : selectedStateName}
        </h3>
        <div>
          {choiceInputs.input1 && (
            <div>
              <ConservationPracticeOverview
                data={data}
                error={error}
                isSuccess={isSuccess}
                isError={isError}
                isLoading={isLoading}
              />
            </div>
          )}
          {choiceInputs.input1 && (
            <div className='pdf-header-space'>
              <ConservationPracticeVideo selectedPracticeId={practiceId} />
            </div>
          )}
          <div className={rcTreatedInputs.size < 1 ? 'hidden-content' : ''}>
            <ResourceConcernTreated
              selectedStateCode={selectedStateCode}
              selectedPracticeId={practiceId}
              rcRef={rcRef2}
            />
          </div>
          {choiceInputs.input2 && (
            <ImplementationExtent data={data} isSuccess={isSuccess} />
          )}
          {choiceInputs.input3 && (
            <SpecificationsAndTools
              selectedStateCode={selectedStateCode}
              selectedPracticeId={practiceId}
              data={data}
              isSuccess={isSuccess}
            />
          )}
          {choiceInputs.input4 && (
            <ApplicationImpacts data={data} isSuccess={isSuccess} />
          )}
          {selectedProjInitData.length > 0
            ? renderProjInits(selectedProjInitData)
            : null}
        </div>
      </div>
    );
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, [choiceInputs, rcTreatedInputs, selectedProjInitData]);

  return (
    <div data-testid='preview' className='pdf-preview'>
      <h3>Preview</h3>
      <div>{contentToRender()}</div>
      <div className='hidden-content'>{contentToRenderPdf()}</div>
    </div>
  );
};

export default ReportPreview;
