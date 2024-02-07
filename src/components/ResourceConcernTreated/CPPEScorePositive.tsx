import './resource-concern-treated.scss';

const CPPEScorePositive = (resourceConcerns: any) => {
  const rc = resourceConcerns;

  return (
    <>
      {rc.resourceConcerns && (
        <section className='child-accordion'>
          <h2> &nbsp; Postive Effects (Improving) </h2>
          <hr />
          {rc.resourceConcerns.map((rcRecord) => {
            return (
              <>
                {(() => {
                  const item = rcRecord.cppeEffectValue;
                  const numericValue = Number(item);
                  const text = `+${item}`;
                  if (numericValue > 0)
                    return (
                      <>
                        <div className='single-content' key={rcRecord.rcId}>
                          <div className='green-box2'> {text} </div>
                          <div className='content-description'>
                            <h1>{rcRecord.rcName}</h1>
                            <p>{rcRecord.rcDescription}</p>
                          </div>
                        </div>
                      </>
                    );
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
