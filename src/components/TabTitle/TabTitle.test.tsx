import TabTitle from './TabTitle';
import { cleanup, render, screen } from '../../common/test-utils/test_utils';

afterEach(() => {
  cleanup();
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({
    stateCode: '06',
    category: '2',
  }),
}));
let stateName = 'Colorado';
let currentTab = '';

describe('TabTitle is rendered correctly', () => {
  beforeEach(() => {
    render(<TabTitle stateName={stateName} currentTab={currentTab} />);
  });

  test('Should display the contents of TabTitle', () => {
    expect(screen.getByTestId('tab-title')).toBeDefined();
  });

  test('Should display the state name', () => {
    expect(screen.getByText('Colorado')).toBeInTheDocument();
  });
});

describe('TabTitle is rendered correctly', () => {
  beforeEach(() => {
    render(<TabTitle stateName={null} currentTab={currentTab} />);
  });

  test('Should display the state name', () => {
    expect(screen.getByText('National')).toBeInTheDocument();
  });
});
