import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../Redux/hooks/hooks';
import verifyTableauIsEmpty, {
  verifyUrlIsValid,
} from '../../common/util/tableau';
import './tableau-report.scss';

declare global {
  // eslint-disable-next-line  no-unused-vars
  interface Window {
    tableau: any;
    dataLayer: any;
  }
}

let viz;
const { tableau } = window;
const ConservationPracticeCategory = ({ pageName, setIsTableauEmpty }: any) => {
  const uiText = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  ); 

  const ref = useRef(null);
  const stateAbbrInRedux = useAppSelector(
    (state: any) => state?.stateSlice?.stateAbbreviation
  );
  const stateAbbr =
    stateAbbrInRedux === 'National' || stateAbbrInRedux === undefined
      ? ''
      : stateAbbrInRedux;
  const srcLink: string = `${
    uiText?.ConservationPracticeCategoryLink?.configurationValue
  }=${stateAbbr}&Measure=${pageName.replace('&', '%26')}`;

  const receiveMessage = () => {
    verifyTableauIsEmpty(viz, setIsTableauEmpty);
  };

  const initViz = () => {
    if (!verifyUrlIsValid(srcLink)) {
      setIsTableauEmpty(true);
      return;
    }
    const options = {
      device: 'desktop',
    };
    // eslint-disable-next-line no-new
    if (viz) viz.dispose();
    viz = new tableau.Viz(ref.current, srcLink, options);
    viz.addEventListener(
      tableau.TableauEventName.CUSTOM_VIEW_LOAD,
      receiveMessage
    );
  };

  useEffect(() => {
    initViz();
  }, [stateAbbrInRedux]);

  return (
    <div
      className='tableau-report-container'
      data-testid='tableau-report-container'
    >
      <div ref={ref} />
    </div>
  );
};

export default ConservationPracticeCategory;
