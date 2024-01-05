import { useEffect, useState } from 'react';
import './resource-concern-treated.scss';
import { PracticeEntry } from '../CPPEScoreView/utils';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';

const CPPEScorePositive = (resourceConcerns: any ) => {
  const rc = resourceConcerns;
  const [dataL, setDataL] = useState<Array<PracticeEntry>>([]);
  const searchInputData = {
    resourceId: rc.resourceConcerns[0].rcId ,
    stateCode: '00',
    //practice_category_id: currentPracticeCategoryId,
  };
  const { data : getCppeScoresData,
    error,
    isLoading,
    isSuccess,
    isError, } = useGetCPPEScoresQuery(searchInputData);

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
        practiceInfo:p.practiceInfo 
      }));
      fetchData.sort((a: any, b: any): any => {
        return b.cppeScore - a.cppeScore;
      });
      setDataL(fetchData.filter((item) => (item.cppeScore > 0)));
    
    }
  }, [getCppeScoresData]);

  return (
   <>
      {dataL && (
        <section className='child-accordion'>
          <h2> &nbsp; Postive Effects (Improving) </h2>
          <hr/>
          {dataL.map((resourceConcern) => {
            return ( <>
               {(() => { 
                     const item = resourceConcern.cppeScore;
                     const numericValue = Number(item);
                     const text = `+${item}`;
                     if (numericValue > 0)
                       return ( <>
                            <div className='single-content' key={resourceConcern.practiceId} > 
                                <div className='green-box2'> {text} </div> 
                                   <div className='content-description'>
                                        <h1>{resourceConcern.title}</h1>
                                        <p>{resourceConcern.rationale}</p>
                                    </div>
                            </div>
                          </> );       
                })()}  
            </>            
            );   
          })}
      </section>
      )}
    </>  
  );
};

export default CPPEScorePositive;