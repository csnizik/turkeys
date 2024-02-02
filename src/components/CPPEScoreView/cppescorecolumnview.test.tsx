// import { resourceConcern } from '../../api-mocks/constants';
import { renderHook } from '@testing-library/react-hooks';
import { cleanup, render, screen } from '../../common/test-utils/test_utils';
import CPPESCoreView, { download } from './CPPEScoreColumnView';
import { IIndividualResourceConcern } from '../../common/types';
import { useGetCPPEScoresQuery } from '../../Redux/services/api';

const mockedResourcesResponse = [
  {
    cppeMatrixId: 189,
    practiceName: 'Alley Cropping',
    practiceCode: '311',
    resourceConcernsId: 154,
    practiceCategoryId: 10,
    cppeEffectValue: 5,
    rationale:
      'Vegetation and surface litter reduce raindrop impact and slow runoff water increasing infiltration.',
    practiceInfo:
      'Alley cropping can be used to  achieve objectives such as reducing surface water runoff and soil erosion, altering water table depths, reducing offsite movement of nutrients, modifying the microclimate for improved crop production, providing habitat for wildlife and beneficial insects, and increasing net carbon storage. Alley cropping can also diversify a farm enterprise by adding tree/shrub products or non-traditional or value-added crops such as sunflowers or medicinial herbs. Some common examples of alley cropping plantings include wheat, corn, soybeans, or hay planted between rows of black walnut or pecan trees.',
    createdBy: 1,
    createdDate: '2023-07-11T11:35:28.16',
    lastModifiedBy: null,
    lastModifiedDate: null,
  },
];

const resourceConcern: IIndividualResourceConcern = {
  resourceConcernId: 1,
  resourceConcernCategoryId: 2,
  rcSwapacategoryId: 3,
  resourceConcernName: 'Soil',
  resourceConcernDescription: 'Soil',
};

const stateCode = '01';

afterEach(() => {
  cleanup();
});

describe('Verify CPPEScore is rendered correctly', () => {
  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(mockedResourcesResponse));
    const { result, waitForNextUpdate } = renderHook(() =>
      useGetCPPEScoresQuery({
        resourceId: resourceConcern.resourceConcernId,
      })
    );
    render(
      <CPPESCoreView resourceConcern={resourceConcern} stateCode={stateCode} />
    );
  });

  test('Verify CPPEScoreEntry component', async () => {
    expect(screen.getByText('Sort By:')).toBeInTheDocument();
    expect(screen.getByText('Conservation Practice(s)')).toBeInTheDocument();
    expect(screen.getByText('Filter by CPPE')).toBeInTheDocument();
    expect(screen.getByText('Filter by practice category')).toBeInTheDocument();
    expect(screen.getByText('Practice Information')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  test('Verify Select All Check', async () => {
    expect(screen.getByTestId('selectAll')).toBeInTheDocument();
    expect(screen.getByTestId('selectAll')).not.toBeChecked();
    screen.getByTestId('selectAll').click();
    expect(screen.getByTestId('selectAll')).toBeChecked();
  });
});

describe('Verify helper functions', () => {
  test('Verify download', async () => {
    const filename = 'test-filename.csv';
    const text = 'field1,field2,field3\na,b,c';
    const element = download(filename, text);
    expect(element.getAttribute('href')).toBe(
      'data:text/plain;charset=utf-8,field1%2Cfield2%2Cfield3%0Aa%2Cb%2Cc'
    );
    expect(element.getAttribute('download')).toBe(filename);
    expect(element.style.display).toBe('none');
  });
});
