import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../Redux/hooks/hooks';
import './tableau-report.scss';
import verifyTableauIsEmpty, {
  verifyUrlIsValid,
} from '../../common/util/tableau';

let viz;
const { tableau } = window;
const TopPracticesEQUIPOpenData = ({ setIsTableauEmpty }: any) => {
  const uiText = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  ); 

  const ref = useRef(null);
  let stateName = useAppSelector(
    (state: any) => state?.stateSlice?.stateNameDisplay
  );
  if (stateName === 'National' || stateName === undefined) stateName = 'National';

  const srcLink: string = `${uiText?.TopPracticesEQUIPOpenDataLink?.configurationValue}=${stateName}&:tabs=no`;

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
  }, [stateName]);

  return (
    <div
      className='tableau-report-container'
      data-testid='tableau-report-container'
    >
      <div ref={ref} />
    </div>
  );
};

export default TopPracticesEQUIPOpenData;
