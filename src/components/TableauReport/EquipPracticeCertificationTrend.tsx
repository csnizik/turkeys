import { useEffect } from 'react';
import { useAppSelector } from '../../Redux/hooks/hooks';
import { tableauGraph } from '../../common/typedconstants.common';
import verifyTableauIsEmpty, {
  verifyUrlIsValid,
} from '../../common/util/tableau';
import './tableau-report.scss';

const { tableau } = window;
let viz;
const EquipPracticeCertificationTrend = ({
  practiceCode,
  checkTableauIsEmpty,
}: any) => {
  const uiText = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  ); 
  
  let stateName = useAppSelector(
    (state: any) => state?.stateSlice?.stateNameDisplay
  );
  if (stateName === 'National') stateName = 'National';
  const fromPdfReport = useAppSelector(
    (state) => state?.pdfGenSlice?.enablePdfGen
  );

  const finalLink = fromPdfReport
    ? uiText?.EquipPracticeCertificationTrendImageLink?.configurationValue
    : uiText?.EquipPracticeCertificationTrendLink?.configurationValue;
  const srcLink: string = `${finalLink}=${stateName}&practice_code_num=${practiceCode}&:tabs=no`;

  const receiveMessage = () => {
    verifyTableauIsEmpty(viz, checkTableauIsEmpty);
  };

  const initViz = () => {
    if (!verifyUrlIsValid(srcLink)) {
      checkTableauIsEmpty(true);
      return;
    }
    const options = {
      device: 'desktop',
    };
    const containerDiv = document.getElementById(
      'equip-practice-certification-trend'
    );
    // eslint-disable-next-line no-new
    if (viz) viz.dispose();
    viz = new tableau.Viz(containerDiv, srcLink, options);
    viz.addEventListener(
      tableau.TableauEventName.CUSTOM_VIEW_LOAD,
      receiveMessage
    );
  };

  useEffect(() => {
    if (!fromPdfReport) initViz();
  }, [stateName, fromPdfReport]);

  return (
    <div
      className='tableau-report-container'
      id='equip-practice-certification-trend'
      data-testid='tableau-report-container'
    >
      {fromPdfReport && (
        <img
          src={srcLink}
          alt={tableauGraph.EquipPracticeCertificationTrend.displayName}
        />
      )}
    </div>
  );
};

export default EquipPracticeCertificationTrend;
