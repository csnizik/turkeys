import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../Spinner/Spinner';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';
import CPPERow from './CPPERow';
import './cppe-score.scss';

const CPPEScore = ({
  selectedStateCode,
  selectedResourceConcernId,
}: //rcRef,
any) => {
  const { data, error, isLoading, isSuccess, isError } = useGetCPPEScoresQuery({
    resourceId: selectedResourceConcernId,
  });

  const [tab, setTab] = useState(null);

  const { t } = useTranslation();

  const toggleExpandPractice = (PracticeId: any) => {
    if (tab === PracticeId) {
      return setTab(null);
    }
    return setTab(PracticeId);
  };

  const renderAccordion = () => {
    if (isSuccess && data && data.length >= 1) {
      const categoryChart = [
        { number: 5, description: 'Substantial Improvement' },
        { number: 4, description: 'Moderate to Substantial Improvement' },
        { number: 3, description: 'Moderate Improvement' },
        { number: 2, description: 'Slight to Moderate Improvement' },
        { number: 1, description: 'Slight Improvement' },
        { number: -1, description: 'Slight Worsening' },
        { number: -2, description: 'Slight to Moderate Worsening' },
        { number: -3, description: 'Moderate Worsening' },
        { number: -4, description: 'Moderate to Substantial Worsening' },
        { number: -5, description: 'Moderate to Substantial Worsening' },
      ];
      return (
        <>
          {categoryChart.map((score: any) => {
            return (
              <CPPERow
                currentTab={tab}
                rowData={data}
                toggleExpandPractice={toggleExpandPractice}
                categoryHeading={score.description}
                categoryNumber={score.number}
              />
            );
          })}
        </>
      );
    }
    return null;
  };

  return (
    <section className='result-accordion-container'>
      {isLoading && <Spinner />}
      {isError && error}
      <div className='top-title'>
        <h2>Conservation Practices Ranked by Physical Effects</h2>
      </div>
      {renderAccordion()}
      {isSuccess && data && data.length <= 0 && (
        <p className='lead margin-3 padding-left-3'>
          {t('search-results-page.no-practices-found')}
        </p>
      )}
    </section>
  );
};

export default CPPEScore;
