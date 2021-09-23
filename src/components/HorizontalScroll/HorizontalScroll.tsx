import { useState } from 'react';
import './horizontal-scroll.scss';
import { IConservationPracticeSections } from '../../common/types';
import { ConservationPracticeSections } from '../../common/typedconstants.common';

const HorizontalScroll = () => {
  const [sectionState] = useState<IConservationPracticeSections[]>(
    ConservationPracticeSections
  );

  return (
    <div className='horizontal-scroll'>
      <hr className='top-border' />
      <div className='scroll_container'>
        <p className='title'>On this page:</p>
        {sectionState.length &&
          sectionState.map((section: IConservationPracticeSections) => {
            return (
              <a key={section.sectionId} href={section.anchorLink}>
                <p className='skin_option'>{section.sectionName}</p>
              </a>
            );
          })}
      </div>
      <hr />
    </div>
  );
};

export default HorizontalScroll;