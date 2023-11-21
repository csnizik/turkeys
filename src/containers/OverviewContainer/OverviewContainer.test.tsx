import OverviewContainer from '.';
import { cleanup, render, screen } from '../../common/test-utils/test_utils';

afterEach(() => {
  cleanup();
});

describe('Overview container is rendered correctly', () => {
  const stateNameDisplay = 'National';
  beforeEach(() => {
    render(<OverviewContainer stateNameDisplay={stateNameDisplay} />);
  });

  test('Should display the contents of the overview container', () => {
    expect(screen.getByTestId('overview-container')).toBeInTheDocument();
  });

  test('Should display a section for the top five conservation practices', () => {
    expect(
      screen.getByText(`${stateNameDisplay} Top 5 Conservation Practices`)
    ).toBeInTheDocument();
  });

  test('Should display a section for the top five resource concerns', () => {
    expect(
      screen.getByText(`${stateNameDisplay} Top 5 Resource Concerns`)
    ).toBeInTheDocument();
  });
});
