import { useEffect, useState } from 'react';
import './report-builder.scss';

const ReportBuilder = ({
  swapaData,
  choiceInputs,
  setChoiceInputs,
  rcTreatedInputs,
  setRcTreatedInput,
  getRCTreatedComponent,
  reportPreviewData,
  handleGeneratePdf,
  projectsInitiativesData,
  stateName,
  setSelectedProjInitData,
}: any) => {
  const swapaCategoryCnt = swapaData?.result.length;
  const [swapaCategoryIds, setSwapaCategoryIds] = useState(new Set());
  const [projectsInitiativesAll, setProjectsInitiativesAll] = useState(false);
  const [projectsInitiatives, setProjectsInitiatives]: any = useState([]);

  const collectSwapaCategoryIds = () => {
    const tempSet = new Set();
    swapaData?.result.forEach((childData) => {
      tempSet.add(childData.rcCategoryId);
    });
    setSwapaCategoryIds(tempSet);
  };

  useEffect(() => {
    collectSwapaCategoryIds();
    getRCTreatedComponent(new Set());
    const projectsInitiativesSize = projectsInitiativesData.length;
    const initProjectsInitiatives = Array(projectsInitiativesSize).fill(false);
    setProjectsInitiatives(initProjectsInitiatives);
  }, []);

  const handleInput = (e) => {
    const { value, checked } = e.target;
    const newChoiceInput = {
      ...choiceInputs,
      [`input${Number(value) + 1}`]: checked,
    };
    setChoiceInputs(newChoiceInput);
  };

  const toggleAll = () => {
    const tempSet = new Set();
    if (rcTreatedInputs.size < swapaCategoryCnt) {
      swapaCategoryIds.forEach((id) => {
        tempSet.add(id);
      });
      setRcTreatedInput(tempSet);
      getRCTreatedComponent(tempSet);
      return;
    }

    setRcTreatedInput(new Set());
    getRCTreatedComponent(new Set());
  };

  const toggleSingle = (categoryId: any) => {
    const tempSet = new Set();
    swapaCategoryIds.forEach((id) => {
      if (rcTreatedInputs.has(id)) tempSet.add(id);
    });
    if (rcTreatedInputs.has(categoryId)) tempSet.delete(categoryId);
    else tempSet.add(categoryId);
    setRcTreatedInput(tempSet);
    getRCTreatedComponent(tempSet);
  };

  const getIdName = (index: any) => {
    return `swapaInput${index}`;
  };

  const buildCheckboxList = (swapaCategory) => {
    const allInput = (
      <div className='usa-checkbox'>
        <input
          data-testid='all-option'
          className='usa-checkbox__input'
          id='allRc'
          type='checkbox'
          name='allRc'
          aria-label='All resource concerns treated'
          value='All'
          checked={rcTreatedInputs.size >= swapaCategoryCnt}
          onChange={() => toggleAll()}
        />
        <label className='usa-checkbox__label' htmlFor='allRc'>
          All
        </label>
      </div>
    );
    const part2 = swapaCategory?.result.map((item, index) => {
      return (
        <div key={item.rcCategoryId} className='usa-checkbox'>
          <input
            data-testid={`${item.rcCategoryName}-option`}
            className='usa-checkbox__input'
            id={getIdName(index)}
            type='checkbox'
            name={getIdName(index)}
            value={item.rcCategoryId || 0}
            checked={rcTreatedInputs.has(item.rcCategoryId)}
            onChange={() => toggleSingle(item.rcCategoryId)}
          />
          <label className='usa-checkbox__label' htmlFor={getIdName(index)}>
            {item.rcCategoryName}
          </label>
        </div>
      );
    });
    return (
      <div>
        {allInput}
        {part2}
      </div>
    );
  };

  const toggleAllProjectsInitiatives = () => {
    const checkedValue = !projectsInitiativesAll;
    setProjectsInitiativesAll(checkedValue);
    setProjectsInitiatives([...projectsInitiatives].fill(checkedValue));
  };

  const toggleSingleProjectsInitiative = (initiative) => {
    setProjectsInitiatives(
      Object.assign([...projectsInitiatives], {
        [initiative]: !projectsInitiatives[initiative],
      })
    );
  };

  useEffect(() => {
    setProjectsInitiativesAll(!projectsInitiatives.includes(false));
    const selectedItems: any = [];
    projectsInitiatives.forEach((element, index) => {
      if (element) selectedItems.push(projectsInitiativesData[index]);
      setSelectedProjInitData(selectedItems);
    });
  }, [projectsInitiatives]);

  const buildProjectsInitiativesCheckboxList = (projInitiativesData) => {
    const allInput = (
      <div className='usa-checkbox'>
        <input
          className='usa-checkbox__input'
          id='projInitInputAll'
          type='checkbox'
          name='projInitInputAll'
          aria-label='All Practice Initiatives'
          value='All'
          checked={projectsInitiativesAll}
          onChange={() => toggleAllProjectsInitiatives()}
        />
        <label className='usa-checkbox__label' htmlFor='projInitInputAll'>
          All
        </label>
      </div>
    );
    const part2 = projInitiativesData?.map((item, index) => {
      return (
        <div key={item.title} className='usa-checkbox'>
          <input
            className='usa-checkbox__input'
            id={`projInitInput${index}`}
            type='checkbox'
            name={`projInitInput${index}`}
            value={index}
            checked={projectsInitiatives[index]}
            onChange={() => toggleSingleProjectsInitiative(index)}
          />
          <label
            className='usa-checkbox__label'
            htmlFor={`projInitInput${index}`}
          >
            {item.title}
          </label>
        </div>
      );
    });
    return (
      <>
        {' '}
        {allInput}
        {part2}
      </>
    );
  };

  return (
    <div className='builder-container'>
      <div className='checkbox-container'>
        <div className='usa-checkbox'>
          <input
            className='usa-checkbox__input'
            id='practiceOverview'
            type='checkbox'
            name='practiceOverview'
            aria-label='Practice Overview'
            value={0}
            onChange={handleInput}
          />
          <label className='usa-checkbox__label' htmlFor='practiceOverview'>
            Practice Overview
          </label>
        </div>
        <div className='builder-title'>Resource Concerns Treated</div>

        <div className='swapa-checkbox-list'>
          {buildCheckboxList(swapaData)}
        </div>

        <div className='usa-checkbox'>
          <input
            className='usa-checkbox__input'
            id='currentPracticeSupport'
            type='checkbox'
            aria-label={
              stateName === 'National'
                ? `National Support for the ${reportPreviewData?.practiceName} Practice`
                : `Support for the ${reportPreviewData?.practiceName} Practice in ${stateName}`
            }
            name='currentPracticeSupport'
            value={1}
            onChange={handleInput}
          />
          <label
            className='usa-checkbox__label'
            htmlFor='currentPracticeSupport'
          >
            {stateName === 'National'
              ? `National Support for the ${reportPreviewData?.practiceName} Practice`
              : `Support for the ${reportPreviewData?.practiceName} Practice in ${stateName}`}
          </label>
        </div>

        <div className='usa-checkbox'>
          <input
            className='usa-checkbox__input'
            id='currentPracticeST'
            type='checkbox'
            name='currentPracticeST'
            aria-label={`${reportPreviewData?.practiceName} Specifications & Tools`}
            value={2}
            onChange={handleInput}
          />
          <label className='usa-checkbox__label' htmlFor='currentPracticeST'>
            {`${reportPreviewData?.practiceName} Specifications & Tools`}
          </label>
        </div>

        <div className='builder-title'>
          {stateName === 'National' ? 'National' : stateName}{' '}
          {'Projects & Initiatives Using the '}
          {reportPreviewData?.practiceName}
          {' practice'}
        </div>
        <div className='projects-initiatives-list'>
          {buildProjectsInitiativesCheckboxList(projectsInitiativesData)}
        </div>
      </div>
      <button
        className='pdf-button'
        onClick={() => handleGeneratePdf()}
        type='button'
      >
        Print Report
      </button>
    </div>
  );
};

export default ReportBuilder;
