import './resource-concern-treated.scss';

const CPPEScoreNegative = (resourceConcerns: any) => {
  const rc = resourceConcerns;

  return (
    <>
      {rc.resourceConcerns && (
        <section className='child-accordion'>
          <h2> &nbsp; Negative Effects (Worsening) </h2>
          <hr />
          {rc.resourceConcerns.map((rcRecord) => {
            return (
              <>
                <div className='single-content' key={rcRecord.rcId}>
                  <div className='red-box2'> {rcRecord.cppeEffectValue} </div>
                  <div className='content-description'>
                    <h1> {rcRecord.rcName}</h1>
                    <p>{rcRecord.rcDescription}</p>
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
