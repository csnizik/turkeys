import { Nav } from 'reactstrap';
import Tab from '../Tab';
import './custom-tabs.scss';

interface ISubjectProps {
  currOption: number;
  tabStyleOption: number;
  searchOptionList: any;
  handleChangeSearchOption: Function;
  hideOverviewTab: boolean;
}

interface INavigationOptions {
  tabs: boolean;
  className: string;
}

const CustomTabs = ({
  currOption,
  searchOptionList,
  handleChangeSearchOption,
  tabStyleOption,
  hideOverviewTab
}: ISubjectProps) => {
  const navOptions: INavigationOptions = {
    tabs: tabStyleOption === 0,
    className: tabStyleOption === 1 ? 'nav-fpac' : '',
  };
  const renderSearchOptions = () => {
    return (
      <Nav {...navOptions}>
        {Object.keys(searchOptionList).map((option: any) => {
          if(hideOverviewTab && searchOptionList[option].id===0) return null;
          return (
            <Tab
              key={option}
              currentSearchOption={currOption}
              option={searchOptionList[option].id}
              displayName={searchOptionList[option].displayName}
              handleSearchChange={handleChangeSearchOption}
            />
          );
        })}
      </Nav>
    );
  };

  return <>{renderSearchOptions()}</>;
};

export default CustomTabs;
