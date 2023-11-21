import classNames from 'classnames';
import TagManager from 'react-gtm-module';
import { useHistory, useParams } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
import './tab.scss';
import { useAppSelector } from '../../Redux/hooks/hooks';

interface ISearchOption {
  option: number;
  displayName: string;
  currentSearchOption: number;
  handleSearchChange: Function;
}

const GTMArg = { gtmId: process.env.REACT_APP_Google_Tag || '' };
TagManager.initialize(GTMArg);

const SearchOption = ({
  displayName,
  option,
  currentSearchOption,
  handleSearchChange,
}: ISearchOption) => {
  const history = useHistory();
  const { stateCode }: any = useParams();
  const listItemClassNames = classNames({
    active: option === currentSearchOption,
    // disabled: option === 0 || option === 2,
  });

  const selectedstate = useAppSelector(
    (state) => state.stateSlice.stateAbbreviation
  );
  const toggleTabs = (tab: number) => {
    handleSearchChange(tab);
    //Google Analytics code for TabClick (tab)
    window.dataLayer.push({ js: new Date() });
    window.dataLayer.push({
      event: 'TabClick',
      EventProps: {
        SearchParameter: tab,
      },
    });
    history.push(`/${stateCode}/${displayName.split(' ').join('')}`);
  };
  const getTabTitle = () => {
    return `${selectedstate || 'National'} ${displayName}`;
  };

  return (
    <NavItem>
      <NavLink
        className={listItemClassNames}
        href='#'
        onClick={() => {
          toggleTabs(option);
        }}
      >
        <p className='links'>{getTabTitle()}</p>
      </NavLink>
    </NavItem>
  );
};

export default SearchOption;
