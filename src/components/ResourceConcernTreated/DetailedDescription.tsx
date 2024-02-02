import { useEffect, useState } from 'react';
import './resource-concern-treated.scss';
import ResourceConcernTags from './ResourceConcernTags';
import { PracticeEntry } from '../CPPEScoreView/utils';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';

const DetailedDescription = (resourceConcerns: any, prop: {}) => {
  const rc = resourceConcerns;
  const positiveCPPE = prop;
  const [dataL, setDataL] = useState<Array<PracticeEntry>>([]);
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

      // const [dataR, setDataR] = useState<Array<PracticeEntry>>([]);
      //fetchData.filter((item) => (item.cppeScore < 0));
      if (positiveCPPE) {
        setDataL(fetchData.filter((item) => item.cppeScore > 0));
      } else setDataR(fetchData.filter((item) => item.cppeScore < 0));

      // fetchData.sort((a: any, b: any): any => {
      //   return b.cppeScore - a.cppeScore;
      // });
      //setDataL(fetchData);
      //setDataR(negativeData);
    }
  }, [getCppeScoresData]);

  return (
    <>
      {dataL && (
        <section className='child-accordion'>
          {dataL.map((resourceConcern) => {
            return (
              <>
                {(() => {
                  const item = resourceConcern.cppeScore;
                  const numericValue = Number(item);
                  const text = `+${item}`;
                  if (numericValue > 0)
                    return (
                      <>
                        <h2> &nbsp; Postive Effects (Improving) </h2>
                        <div
                          className='single-content'
                          key={resourceConcern.practiceId}
                        >
                          <div className='green-box'> {text} </div>
                          <div className='content-description'>
                            <h1>{resourceConcern.title}</h1>
                            <p>{resourceConcern.rationale}</p>
                          </div>
                        </div>
                      </>
                    );
                  else {
                    return (
                      <>
                        <h2> &nbsp; Negative Effects (Woresening) </h2>
                        <div
                          className='single-content'
                          key={resourceConcern.practiceId}
                        >
                          <div className='red-box'>
                            {' '}
                            {resourceConcern.cppeScore}{' '}
                          </div>
                          <div className='content-description'>
                            <h1> {resourceConcern.title}</h1>
                            <p>{resourceConcern.rationale}</p>
                          </div>
                        </div>
                      </>
                    );
                  }
                })()}
              </>
            );
          })}
        </section>
      )}
    </>
  );
};

export default DetailedDescription;
