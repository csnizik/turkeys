import { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
/* eslint-disable-next-line import/no-unresolved */
import { useReactToPrint } from 'react-to-print';
import './report-preview-creator.scss';
import {
  useGetRelatedResourceConcernCategoryQuery,
  useGetNationalOverviewByPracticeQuery,
} from '../../Redux/services/api';
import ReportBuilder from '../ReportBuilder';
import ReportPreview from '../ReportPreview';
import { useAppSelector } from '../../Redux/hooks/hooks';
import closebtn from './image/close-button.png';

interface DomChild {
  className: string;
  textContent: string;
}

interface DomParent {
  children: Array<DomChild>;
}

const subTitle: string = `Select the information you'd like to include in your report:`;

const ReportPreviewCreator = ({
  openModal,
  handleCreateReport,
  cleanModal,
  projectsInitiativesData,
}: any) => {
  const rcRef = useRef();
  const rcRef2 = useRef();
  const [rcTreatedInputs, setRcTreatedInputs] = useState(new Set());
  const [childArr, setChildArr] = useState<DomParent>();
  const [childArr2, setChildArr2] = useState<DomParent>();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedProjInitData, setSelectedProjInitData] = useState([]);
  const [choiceInputs, setChoiceInputs] = useState({
    input1: false,
    input2: false,
    input3: false,
  });

  useEffect(() => {
    setRcTreatedInputs(new Set());
    setChildArr(rcRef.current);
    setChildArr2(rcRef2.current);
    setChoiceInputs({
      input1: false,
      input2: false,
      input3: false,
    });
  }, [cleanModal]);

  useEffect(() => {
    if (!childArr) return;
    if (!childArr.children) return;
    Array.prototype.forEach.call(childArr?.children, (child) => {
      const categoryId: number = +child.textContent.charAt(0);
      child.className = selectedIds.has(categoryId) // eslint-disable-line no-param-reassign
        ? 'accordion-container'
        : 'hidden-content';
    });
  }, [childArr, selectedIds]);

  useEffect(() => {
    if (!childArr2) return;
    if (!childArr2.children) return;
    Array.prototype.forEach.call(childArr2?.children, (child) => {
      const categoryId: number = +child.textContent.charAt(0);
      child.className = selectedIds.has(categoryId) // eslint-disable-line no-param-reassign
        ? 'accordion-container'
        : 'hidden-content';
    });
  }, [childArr2, selectedIds]);

  const state = useAppSelector((s) => s);
  const practiceId: any = state?.practiceSlice?.selectedSpecficPractice;
  let stateCode = state?.practiceSlice?.searchInput?.state_county_code;
  if (!stateCode) stateCode = state?.stateSlice?.stateCode;
  if (!stateCode) stateCode = '00';
  if (stateCode.length > 2) stateCode = stateCode.slice(0, 2);

  let stateName = state?.practiceSlice?.searchInfo.state;
  if (!stateName) stateName = state?.stateSlice?.stateNameDisplay;
  if (!stateName) stateName = 'National';

  const initialFilter = {
    stateCode,
    practiceId,
  };

  const { data } = useGetRelatedResourceConcernCategoryQuery(initialFilter);
  const reportPreviewData = useGetNationalOverviewByPracticeQuery(practiceId);

  const getRCTreatedComponent = (newSelectedIds) => {
    setSelectedIds(newSelectedIds);
    setChildArr(rcRef.current);
    setChildArr2(rcRef2.current);
  };

  const handlePrint = useReactToPrint({
    content: () => document.getElementById('preview-content-pdf'),
  });

  return (
    <Modal isOpen={openModal}>
      <ModalBody>
        <div className='creator-container'>
          <div className='report-header'>
            <div className='create-report-title'>Create a Custom Report</div>
            <button
              className='close-btn'
              onClick={() => handleCreateReport()}
              type='button'
            >
              <img src={closebtn} alt='close button' />
            </button>
          </div>
          <div className='create-report-subtitle'>{subTitle}</div>
          <div className='horz-line'>
            <hr />
          </div>
          <div className='report-container'>
            <ReportBuilder
              stateName={stateName}
              swapaData={data}
              choiceInputs={choiceInputs}
              setChoiceInputs={setChoiceInputs}
              rcTreatedInputs={rcTreatedInputs}
              setRcTreatedInput={setRcTreatedInputs}
              getRCTreatedComponent={getRCTreatedComponent}
              reportPreviewData={reportPreviewData.data}
              handleGeneratePdf={handlePrint}
              projectsInitiativesData={projectsInitiativesData}
              setSelectedProjInitData={setSelectedProjInitData}
            />
            <div className='preview-container'>
              <ReportPreview
                selectedStateName={stateName}
                selectedStateCode={stateCode}
                choiceInputs={choiceInputs}
                rcTreatedInputs={rcTreatedInputs}
                reportPreviewData={reportPreviewData}
                practiceId={practiceId}
                rcRef={rcRef}
                rcRef2={rcRef2}
                selectedProjInitData={selectedProjInitData}
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ReportPreviewCreator;
