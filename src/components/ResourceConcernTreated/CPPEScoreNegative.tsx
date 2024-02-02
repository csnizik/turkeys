import { useEffect, useState } from 'react';
import './resource-concern-treated.scss';
import { PracticeEntry } from '../CPPEScoreView/utils';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';

const CPPEScoreNegative = (resourceConcerns: any) => {
  const rc = resourceConcerns;
  const [dataR, setDataR] = useState<Array<PracticeEntry>>([]);
  const searchInputData = {
    resourceId: rc.resourceConcerns[0].rcId,
    //practice_category_id: currentPracticeCategoryId,
  };
  const {
    data: getCppeScoresData,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useGetCPPEScoresQuery(searchInputData);
  // use effect
  useEffect(() => {
    if (getCppeScoresData !== undefined) {
      // Call API from here
      const fetchData: PracticeEntry[] = getCppeScoresData.map((p) => ({
        cppeScore: p.cppeEffectValue,
        practiceCode: p.practiceCode,
        title: p.practiceName,
        rationale: p.rationale,
        practiceCategoryId: p.practiceCategoryId,
        practiceId: p.practiceId,
        practiceInfo: p.practiceInfo,
      }));
      setDataR(fetchData.filter((item) => item.cppeScore < 0));
      dataR.sort((a: any, b: any): any => {
        return b.cppeScore - a.cppeScore;
      });
    }
  }, [getCppeScoresData]);

  return (
    <>
      {dataR && (
        <section className='child-accordion'>
          <h2> &nbsp; Negative Effects (Woresening) </h2>
          <hr />
          {dataR.map((resourceConcern) => {
            return (
              <>
                <div
                  className='single-content'
                  key={resourceConcern.practiceId}
                >
                  <div className='red-box2'> {resourceConcern.cppeScore} </div>
                  <div className='content-description'>
                    <h1> {resourceConcern.title}</h1>
                    <p>{resourceConcern.rationale}</p>
                  </div>
                </div>
              </>
            );
          })}
        </section>
      )}
    </>
  );
};

export default CPPEScoreNegative;
