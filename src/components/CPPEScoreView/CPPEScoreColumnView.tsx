import { useState, useEffect, useMemo } from 'react';
import './cppe-score.scss';
import { CPPEScoreEntry } from './CPPEScoreColumnEntry';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';
import { IIndividualResourceConcern } from '../../common/types';
import Spinner from '../Spinner/Spinner';
import { PracticeEntry, getCheckedEntriesKey } from './utils';
import InputTag from '../InputTag/InputTag';
import CPPECaution from './CPPECaution';
import CPPEPracticeLink from './CPPEPracticeLink';
import CPPEScoreLegend from '../CPPESoreLegend/CPPEScoreLegend';

// CSV download
export const download = (filename: string, text: string) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  return element;
};

const csvFields = [
  'Conservation Practice',
  'Code',
  'CPPE',
  'Effect',
  'Rationale',
] as const;

const csvFieldNameToProperty = {
  CPPE: 'id',
  Code: 'Id2',
  'Conservation Practice': 'title',
  Rationale: 'rationale',
} as const;

const CPPESCoreView = ({
  resourceConcern,
  stateCode,
}: {
  resourceConcern: IIndividualResourceConcern;
  stateCode: string;
}) => {
  // Declaration and initilazations of const and properties
  const [flag, setFlag] = useState(false);
  const [activeClassName, setActiveClassName] = useState<Number>();
  const [dataCount, setdataCount] = useState<Number>(-1);
  const [initialData, setInitialData] = useState<Array<PracticeEntry>>([]);
  const [data, setData] = useState<Array<PracticeEntry>>([]);
  const [practice, setPractice] = useState<Array<PracticeEntry>>([]);
  const [checkedEntries, setCheckedEntries] = useState<{
    [id: number]: boolean;
  }>({});
  const numSelectedEntries = useMemo(
    () =>
      Object.values(checkedEntries).reduce(
        (acc, curr) => acc + (curr ? 1 : 0),
        0
      ),
    [checkedEntries]
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const index = 'cppeScore';
  let hidKey: number = 0;
  const categoryChart = {
    5: 'Substantial Improvement',
    4: 'Moderate to Substantial Improvement',
    3: 'Moderate Improvement',
    2: 'Slight to Moderate Improvement',
    1: 'Slight Improvement',
    '-1': 'Slight Worsening',
    '-2': 'Slight to Moderate Worsening',
    '-3': 'Moderate Worsening',
    '-4': 'Moderate to Substantial Worsening',
    '-5': 'Substantial Worsening',
  };
  const CPPE = [
    '+5',
    '+4',
    '+3',
    '+2',
    '+1',
    ' 0',
    '-1',
    '-2',
    '-3',
    '-4',
    '-5',
  ];

  // Event handlers and functions
  // Left panel Row Click event handler
  const handleRowClick = (id: number, selectedPractice: PracticeEntry) => {
    setFlag(true);
    setActiveClassName(id);
    setPractice([selectedPractice]);
    setData(data);
  };
  
  // Data from the CPPE Selection box filter
  const [sortBySelect, setsortBySelect] = useState<string>('');

  // Sort By Event handler
  const handleSelectChange = (value) => {
    if (value === 'highToLowScore') {
      data.sort((a: any, b: any): any => {
        return b.cppeScore - a.cppeScore;
      });
      setData(data);
    } else if (value === 'lowToHighScore') {
      data.sort((a: any, b: any): any => {
        return a.cppeScore - b.cppeScore;
      });
      setData(data);
    } else if (value === 'practiceName') {
      data.sort((a: any, b: any): any => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      setData(data);
    }
    setsortBySelect(value);
    setActiveClassName(-1);
  };

  const {
    data: getCppeScoresData, 
    error,
    isLoading,
    isSuccess,
    isError,
  } = useGetCPPEScoresQuery({
    resourceId: resourceConcern.resourceConcernId,
    stateCode,
  });

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
      setData(fetchData);
      setdataCount(fetchData.length);
      setInitialData(fetchData);
      const tempCheckedEntries = {};
      fetchData.forEach((d) => {
        tempCheckedEntries[getCheckedEntriesKey(d)] = false;
      });
      setCheckedEntries(tempCheckedEntries);
    }
  }, [getCppeScoresData]);

  //ensures that whenever the checkedEntries object changes,
  //the state of the "Select all" checkbox is updated based on whether all checkboxes are checked or not.
  useEffect(() => {
    setSelectAllChecked(
      !Object.values(checkedEntries).some((isChecked) => !isChecked)
    );
  }, [checkedEntries]);

  // Function given the array and index return value of the property
  function GetElement({ array, index, property }) {
    if (index < 0 || index >= array.length) {
      return <div> Invalid index</div>;
    }
    const value = array[index][property];
    if (value === undefined) {
      return <div> Invalid property: {property} </div>;
      //The value of property {property} at index {index} is:
    }
    return <div>{value}</div>;
  }

  // Function return the CPPEScore for a given index
  function getCPPScore(array, index, property) {
    if (index < 0 || index >= array.length) {
      return <div> Invalid index</div>;
    }
    const value = array[index][property];
    if (value === undefined) {
      return null;
    }
    return parseInt(value, 10);
  }

  const [practiceSelected, setPracticeSelected] = useState('');

  const handlePracticeChange = (value) => {
    setPracticeSelected(value);
  };

  // Renders the CPPE description
  const renderDescription = (number) => {
    if (number in categoryChart) {
      return (
        <div key={number} className='desc' style={{ paddingLeft: '20px' }}>
          {' '}
          {categoryChart[number]}
        </div>
      );
    }
    return <div style={{ paddingLeft: '20px' }}> No Effect or N/A </div>;
  };

  function handleExport() {
    const exportedPractices = data.filter(
      (practice) => checkedEntries[getCheckedEntriesKey(practice)]
    );
    const numExportedPractices = exportedPractices.length;
    const filename = `${resourceConcern.resourceConcernName.replaceAll(
      ' ',
      '_'
    )}_CPPE_export_${numExportedPractices}_practices.csv`;
    const csvHeader = `${csvFields.join(',')}\n`;
    const csvBody = exportedPractices.reduce(
      (acc, curr) =>
        `${acc}${csvFields
          .map((field) => {
            if (field === 'Effect') {
              return categoryChart[curr.cppeScore] ?? 'No Comment';
            }
            return `"${curr[csvFieldNameToProperty[field]]}"`;
          })
          .join(',')}\n`,
      ''
    );
    download(filename, `${csvHeader}${csvBody}`);
  }

  // properties for checkbox
  const [expanded, setExpanded] = useState(false);
  const [filterSelections, setFilterSelections] = useState(['']);

  const toggleExpanded = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const handleApplyFilter = () => {
    //console.log("Submitted! Values selected are", filterSelections);
    let newData: any[] = [];
    if (filterSelections.length < 2) {
      newData = initialData;
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    for (let i = 1; i < filterSelections.length; i++) {
      const filterData = initialData.filter((item) => (item.cppeScore === parseInt(filterSelections[i], 10)));
      newData = newData.concat(filterData);
    };
    setData(newData);
  };

  const handleFilterSelect = (event) => {
    //console.log("Submitted! Values selected are", filterSelections);
    if (filterSelections.includes(event.target.value)) {
      setFilterSelections(filterSelections.filter((item) => (item !== event.target.value)));
    } else {    
      setFilterSelections([...filterSelections, event.target.value.toString()]);
    }
  };

  const removeFilter = (event) => {
    setFilterSelections(filterSelections.filter((item) => (item !== event.currentTarget.id)));
    if (filterSelections.length <= 2) {
      setIsVisible(false);
    }
  }

  const clearFilter = () => {
    setFilterSelections([''])
    setIsVisible(!isVisible);
    setData(initialData);
  };

  return (
    <>
      <div className='Alert-container-box'> 
       <CPPEScoreLegend/>
        <div className='container'>
          <p className='title'>
            {dataCount !== -1 ? dataCount : ''} Conservation Practice(s)
            Impacting {resourceConcern.resourceConcernName}
          </p>
          <hr />
          <div className='filter-container'>
            <div className='filter-button-container'>
              {/* Hidden button behind the dummy select tag so that the appearance is the select but functions as a button*/}
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                type='button'
                onClick={toggleExpanded}
                className={`filter-button ${expanded ? "up-arrow" : "down-arrow"}`}
              />
              <select className='filter-button-label'>
                <option value="none" selected disabled hidden>Filter by CPPE &nbsp;&nbsp;&nbsp;&nbsp;</option>
              </select>
              {expanded && (
                <div className='flexbox-vertical'>
                  {CPPE.map((platform) => {
                    const numericValue = Number(platform);
                    let color;
                    if (numericValue === 0) {
                      color = 'grey';
                    } else if (Number(platform) < 0) {
                      color = 'red';
                    } else {
                      color = 'green';
                    }

                    return (
                      <label
                        htmlFor='one'
                        className='flexbox-select'
                        key={platform}
                      >
                        <input
                          type='checkbox'
                          checked={filterSelections.includes(platform)}
                          name={platform}
                          value={platform}
                          className='m-3 cursor-pointer'
                          onClick={event => handleFilterSelect(event)}
                        />
                        <div className={`filter-${color}-box`}>{platform}</div>
                        {numericValue !== 0 && (
                          <span className='CPPETEXT'>
                            {categoryChart[numericValue]}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              type='button'
              className='apply-button'
              onClick={handleApplyFilter}
            >
              Apply
            </button>
          </div>
          {isVisible && (
            <div className='filters-select'>
              <span className='filter-lable'>Active&nbsp;Filters:</span>
              {filterSelections.slice(1).map((filter) => (
                <div id ={filter} key={filter} className='filters-select-input' onClick={removeFilter}>
                  <InputTag description={`CPPE: ${filter}`}/>
                </div>
              ))}
              {(() => {
                if (practiceSelected !== '') {
                  return <InputTag description={practiceSelected} />;
                }
                return null;
              })()}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events */}
              <a
                role='button'
                tabIndex={0}
                className='clear-all-link'
                onClick={clearFilter}
              >
                Clear&nbsp;All
              </a>
            </div>
          )}
          <div className='dropdown'>
            <label className='select-all-check'>
              <input
                type='checkbox'
                data-testid='selectAll'
                className='selectAll'
                checked={selectAllChecked}
                onChange={() => {
                  setSelectAllChecked((prevSelectAllChecked) => {
                    setCheckedEntries((prevCheckedEntries) => {
                      const result = {};
                      Object.keys(prevCheckedEntries).forEach((k) => {
                        result[k] = !prevSelectAllChecked;
                      });
                      return result;
                    });
                    return !prevSelectAllChecked;
                  });
                }}
              />
              Select all
            </label>
            <label className='dropdown-items'>
              Sort By:
              <select
                className='sort-by-select'
                onChange={(e) => handleSelectChange(e.target.value)}
              >
                <option value='highToLowScore'>CPPE (high to low)</option>
                <option value='lowToHighScore'>CPPE (low to high)</option>
                <option value='practiceName'>Practice Name</option>
              </select>
            </label>
          </div>
          <div className='child-container'>
            <div className='conservation-practice-wrapper'>
              {!isLoading &&
              isSuccess &&
              data.length > 0 &&
              Object.keys(checkedEntries).length > 0 ? (
                 <div className='conservation-practices'>
                  {data.map((item) => (
                    <CPPEScoreEntry
                      key={hidKey}
                      handleRowClick={handleRowClick}
                      item={item}
                      hiddenKey={hidKey++}
                      activeClassName={activeClassName}
                      checked={checkedEntries[getCheckedEntriesKey(item)]}
                      handleChange={(item: PracticeEntry) => () =>
                        setCheckedEntries((prevCheckedEntries) => ({
                          ...prevCheckedEntries,
                          [getCheckedEntriesKey(item)]:
                            !prevCheckedEntries[getCheckedEntriesKey(item)],
                        }))}
                    />
                  ))}
               </div>
              ) : (
                <Spinner />
              )}
              {isError && error}
              <div className='details'>
                {flag === false ? (
                  <h1>...</h1>
                ) : (
                  <div className='right-pane-container'>      
                  <CPPEPracticeLink practice={practice[0]}/>    
                    
                    <div className='cpp-score'>
                      {(() => {
                        const item = getCPPScore(practice, 0, index);
                        const numericValue = Number(item);
                        const text = `+${item}`;
                        if (numericValue > 0)
                          return <div className='green-box'>{text} </div>;
                        if (numericValue < 0)
                          return <div className='red-box'>{item}</div>;
                        return <div className='white-box'>{item}</div>;
                      })()}

                      {(() => {
                        let item = getCPPScore(practice, 0, index);
                        return renderDescription(item);
                      })()}
                    </div>
                    <h4>
                      {' '}
                      Specification Sheet:{' '}
                      <a href='https://www.nrcs.usda.gov/resources/guides-and-instructions/conservation-practice-standards'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        View the National Standard Document 
                        {'  '}
                        <img
                        src='../../../../images/arrow-up-right.svg'
                        alt='img'
                      />
                      </a>
                     
                    </h4>

                    <div className='rationale-component'>
                      <h3>Rationale</h3>
                      <p>
                        <GetElement
                          array={practice}
                          index={0}
                          property='rationale'
                        />
                      </p>
                    </div>
                    <div className='practice-info-component'>
                      <div className='left'> 
                          <h3> Practice Information</h3>
                          <p>
                            <GetElement
                              array={practice}
                              index={0}
                              property='practiceInfo'
                            />{' '}
                            {/* <p>Tree/shrub establishment involves planting seedlings or cuttings, seeding, or creating conditions that promote natural regeneration.</p> */}
                          </p>    
                      </div>  
                    </div>
                    <CPPECaution practiceCode={practice[0].practiceCode}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='export-container container'>
          <button type='button' className='usa-button' onClick={handleExport}>
            Export {numSelectedEntries} Select Practice(s)
          </button>
        </div>
      </div>
    </>
  );
};

export default CPPESCoreView;
