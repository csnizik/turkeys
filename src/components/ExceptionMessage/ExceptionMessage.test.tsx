import { cleanup, render, screen } from '../../common/test-utils/test_utils';
import ExceptionMessage from './ExceptionMessage';

afterEach(() => {
  cleanup();
});

describe('Exception Message is rendered correctly', () => {

  beforeEach(() => {
    
    render(
      <ExceptionMessage
        exceptionTitle='There are no National projects or initiatives'
        exceptionMessage='The projects below represent projects across the United States.'
      />
    );
  });

  test('Should display the Exception Message Component', () => {
    expect(screen.getByTestId('exception-content-container')).toBeDefined();
  });
  test('Should display the Exception Message title', () => {
    expect(screen.getByTestId('exception-content-title')).toBeDefined();
  });
  test('Should display the Exception Message description', () => {
    expect(screen.getByTestId('exception-content-description')).toBeDefined();
  });
  test('Should display a long paragraph reminding users there are some other projects Nationally', () => {
    expect(
      screen.getByText((content: any, element: any) => {
        if (element) {
          return (
            element.tagName.toLowerCase() === 'p' &&
            content.startsWith('The projects below represent projects across the United States.')
          );
        }
      })
    ).toBeInTheDocument();
  });
  
});
