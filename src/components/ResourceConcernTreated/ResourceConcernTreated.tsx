import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useGetRelatedResourceConcernCategoryQuery } from '../../Redux/services/api';
import Spinner from '../Spinner/Spinner';
import './resource-concern-treated.scss';
import { useAppSelector } from '../../Redux/hooks/hooks';
import CPPEScoreLegend from '../CPPESoreLegend/CPPEScoreLegend';
import CPPEScoreNegative from './CPPEScoreNegative';
import CPPEScorePositive from './CPPEScorePositive';

const ResourceConcernTreated = ({
  selectedStateCode,
  selectedPracticeId,
  rcRef,
}: any) => {
  const initialFilter = {
    stateCode: selectedStateCode,
    practiceId: selectedPracticeId,
  };

  const [tab, setTab] = useState(null);
  const [tab2, setTab2] = useState(null);

  const { data, error, isLoading, isSuccess, isError } =
    useGetRelatedResourceConcernCategoryQuery(initialFilter);

  const fromPdfReport = useAppSelector(
    (state) => state?.pdfGenSlice?.enablePdfGen
  );

  const toggleExpandCategory = (categoryId: any) => {
    if (tab === categoryId) {
      setTab(null);
      return;
    }
    setTab(categoryId);
  };

  const toggleExpandCategory2 = (categoryId: any) => {
    if (tab2 === categoryId) {
      setTab2(null);
      return;
    }
    setTab2(categoryId);
  };

  const renderAccordionSectionPositive = (rcCa: any) => {
    const rc = rcCa;  

    if (!rc || !rc.result || rc.result.length < 1) return null;
    return (
      <div className='accordion-section' ref={rcRef}>
        {rc.result.map((rcCategory: any) => {
          const categoryId = rcCategory.rcCategoryId;
          const chevronClassName = fromPdfReport
            ? 'fas fa-chevron-down'
            : classNames('fas', {
                'fas fa-chevron-down': tab === categoryId,
                'fas fa-chevron-right': tab !== categoryId,
              });
          return (
            <div
              className='accordion-container'
              key={categoryId}
              data-testid='rc-accordion'
              onClick={() => toggleExpandCategory(categoryId)}
              role='presentation'
            >
              <p className='hidden-content'>{categoryId}</p>
              <li key={categoryId}>
                <i className={chevronClassName} />
                <button type='button' className='accordion-data'>
                  <h3>
                    {rcCategory.rcCategoryName}
                    {/* <span className='num-rc-count'>{`(${rcCategory.resourceConcerns.length} resource concerns)`}</span> */}
                  </h3>
                </button>
              </li>
              {(tab === categoryId || fromPdfReport) && (
                <CPPEScorePositive
                resourceConcerns={rcCategory.resourceConcerns}
              />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAccordionSectionNegative = (rcCa: any) => {
    const rc = rcCa;
    if (!rc || !rc.result || rc.result.length < 1) return null;
    return (
      <div className='accordion-section' ref={rcRef}>
        {rc.result.map((rcCategory: any) => {
          const categoryId = rcCategory.rcCategoryId;
          const chevronClassName = fromPdfReport
            ? 'fas fa-chevron-down'
            : classNames('fas', {
                'fas fa-chevron-down': tab2 === categoryId,
                'fas fa-chevron-right': tab2 !== categoryId,
              });
          return (
            <div
              className='accordion-container'
              key={categoryId}
              data-testid='rc-accordion'
              onClick={() => toggleExpandCategory2(categoryId)}
              role='presentation'
            >
              <p className='hidden-content'>{categoryId}</p>
              <li key={categoryId}>
                <i className={chevronClassName} />
                <button type='button' className='accordion-data'>
                  <h3>
                    {rcCategory.rcCategoryName}
                    {/* <span className='num-rc-count'>{`(${rcCategory.resourceConcerns.length} resource concerns)`}</span> */}
                  </h3>
                </button>
              </li>
              {(tab2 === categoryId || fromPdfReport) && (
                <CPPEScoreNegative
                  resourceConcerns={rcCategory.resourceConcerns}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  ); 

  return (
    <>
     {isLoading && <Spinner />}
      {isError && error}
      {isSuccess && data && (
        <section className='rc-treated-box' id='ResourceConcernsTreated'>
          <h2>{uiText?.cpDetailHeadingRC?.configurationValue}</h2>
          <p data-testid='rc-description'>
            {uiText?.cpDetailHeadingRCDescription?.configurationValue}
          </p>
          <CPPEScoreLegend/>
          < div className='cppe-wrapper'>
            <section className='left-side'>{renderAccordionSectionPositive(data)}</section>
            <section className='right-side'>{renderAccordionSectionNegative(data)}</section>
          </div>
        </section>
      )}
    </>
  );
};

export default ResourceConcernTreated;
