import { useTranslation } from 'react-i18next';
import Accordion from '../../components/ResultAccordion';
import ProjectListGroup from '../../components/ProjectListGroup';
import Filters from '../../components/Filter';
import './results.scss';
import Pagination from '../../components/Pagination';

const ResultsContainer = () => {
  const { t } = useTranslation();

  return (
    <div className='results-page'>
      <div className='search-title'>
        <h1>{t('search-results-page.header')}</h1>
        <hr />
      </div>
      <Filters />
      <Accordion />
      <ProjectListGroup />
    </div>
  );
};

export default ResultsContainer;
