import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Practice } from '../../common/types';

const ResultsRow = ({
  rowData,
  toggleChild,
  currentTab,
  toggleChildTab,
  toggleExpandCategory,
  handlePracticeCategorySelection,
  handleSpecificPracticeSelection,
}: any) => {
  const { t } = useTranslation();
  return (
    <>
      <div className='top-title'>
        <h4>{t('search-results-page.conservation-practices')}</h4>
      </div>
      <div className='accordion-section'>
        {rowData.map((practiceCategory: any) => {
          const categoryId = practiceCategory.practiceCategoryId;
          const chevronClassName = classNames('fas', {
            'fas fa-chevron-right': currentTab !== categoryId,
            'fas fa-chevron-down': currentTab === categoryId,
          });
          const accordionClass = classNames({
            'accordion-container': currentTab !== categoryId,
            'accordion-container-blue': currentTab === categoryId,
          });
          return (
            <>
              <div key={categoryId} className={accordionClass}>
                <li>
                  <i
                    className={chevronClassName}
                    onClick={() => toggleExpandCategory(categoryId)}
                    role='presentation'
                  />
                  <div className='accordion-data'>
                    <h4>{practiceCategory.practiceCategoryName}</h4>
                    <div>
                      {currentTab === categoryId && (
                        <p>
                          {practiceCategory.practiceCategoryDescription ||
                            'No description Available'}
                        </p>
                      )}
                      {currentTab === categoryId && (
                        <p>
                          <Link
                            to={{
                              pathname: '/ConservationPractices',
                              state: { detail: categoryId },
                            }}
                            onClick={() =>
                              handlePracticeCategorySelection(categoryId)
                            }
                          >
                            {practiceCategory.practiceCategoryName} Details
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              </div>
              {currentTab === categoryId && (
                <div className='child-accordion-container'>
                  {practiceCategory.practices.map((ele: Practice) => {
                    const childChevronClassName = classNames('fas', {
                      'fa-chevron-right': toggleChildTab !== ele.practiceId,
                      'fa-chevron-down': toggleChildTab === ele.practiceId,
                    });
                    return (
                      <li
                        key={ele.practiceId}
                        onClick={() => toggleChild(ele.practiceId)}
                        role='presentation'
                      >
                        <i className={childChevronClassName} />
                        <div className='child-data'>
                          <h4>{ele.practiceName}</h4>
                          <div>
                            {toggleChildTab === ele.practiceId && (
                              <p>
                                {ele.practiceDescription ||
                                  'No description Available'}
                              </p>
                            )}
                            {toggleChildTab === ele.practiceId && (
                              <p>
                                <Link
                                  to='/ConservationPractices'
                                  onClick={() =>
                                    handleSpecificPracticeSelection(
                                      categoryId,
                                      ele.practiceId
                                    )
                                  }
                                >
                                  {ele.practiceName} Details
                                </Link>
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  <hr />
                </div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default ResultsRow;