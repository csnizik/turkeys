import { Provider } from 'react-redux';
import { setSearchInfo } from '../../Redux/Slice/practiceSlice';
import { createTestStore } from '../../Redux/store';
import { cleanup, render, screen } from '../../common/test-utils/test_utils';
import CPPESCoreView from '../CPPEScoreView/CPPEScoreColumnView';

afterEach(() => {
  cleanup();
});
const resourceInput = {
  resourceConcernId: 10,
  resourceConcernCategoryId: 10,
  rcSwapacategoryId: 1,
  resourceConcernName: 'Cover Crop',
  resourceConcernDescription: 'Grasses, legumes, and forbs planted for seasonal vegetative cover.',

};

let store;

describe(' rendered correctly', () => {
    render(
      <Provider store={store}>
        <CPPESCoreView  stateCode={'00'} resourceConcern={resourceInput} />
      </Provider>
    );
  });

  test('Should display the contents of Filters', () => {
    expect(screen.getByTestId('')).toBeDefined();
  });

  test('Should display filter tool', () => {
    expect(screen.getByText('Filter by CPPE')).toBeInTheDocument();
  });

  test('Should display the landuse from the search inputs', () => {
    expect(screen.getByText('Cropland')).toBeInTheDocument();
  });

  test('Should display the conservation practice from the search inputs', () => {
    expect(screen.getByText('Grasses, legumes, and forbs planted for seasonal vegetative cover.')).toBeInTheDocument();
  });