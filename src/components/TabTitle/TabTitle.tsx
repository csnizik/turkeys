import { useParams } from 'react-router-dom';
import './tab-title.scss';

const TabTitle = ({ stateName, currentTab }: any) => {
  const { category, individual }: any = useParams();
  const ariaTitleParse = () => {
    const first = `${stateName || 'National'}`;
    let second: string;
    if (currentTab === 'Projects And Initiatives' && category === '1')
      second = 'Projects Page';
    else if (
      currentTab === 'Projects And Initiatives' &&
      category === '2' &&
      individual
    )
      second = 'Individual Initiative Page';
    else if (currentTab === 'Projects And Initiatives' && category === '2')
      second = 'Initiatives Page';
    else if (currentTab === 'Projects And Initiatives')
      second = 'Projects and Initiatives Overview';
    else if (individual) second = 'Individual Practice Page';
    else if (category) second = 'Practice Category Page';
    else second = 'Conservation Practice Overview';
    return `${first} ${second}`;
  };
  return (
    <div data-testid='tab-title'>
      <div className='tab-title-container'>
        <h1 className='tab-title-name' aria-label={ariaTitleParse()}>
          {stateName || 'National'} {currentTab}
        </h1>
      </div>
    </div>
  );
};

export default TabTitle;
