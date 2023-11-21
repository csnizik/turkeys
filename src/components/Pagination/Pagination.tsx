import './pagination.scss';

const Pagination = ({
  cards,
  cardsPerPage,
  paginate,
  currentPage,
  indexOfLastPage,
  indexOfFirstCard,
  indexOfLastCard,
  selectedStateName,
  mapComponent,
}: any) => {
  const handlePrevClick = () => {
    paginate(currentPage - 1);
  };

  const handleNextClick = () => {
    paginate(currentPage + 1);
  };

  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(cards / cardsPerPage); i++) {
    pageNumbers.push(i);
  }
  const renderTitle = () => {
    if (mapComponent) {
      return (
        <p>
          {indexOfFirstCard + 1} -{' '}
          {indexOfLastCard < cards ? indexOfLastCard : cards} of {cards}{' '}
          projects
          {selectedStateName !== 'National' && ` for ${selectedStateName}`}
        </p>
      );
    }
    return (
      <p>
        Showing {cards ? 1 : 0} -{' '}
        {indexOfLastCard < cards ? indexOfLastCard : cards} of {cards}{' '}
        projects/initiatives
      </p>
    );
  };
  return (
    <>
      <nav
        aria-label='Pagination'
        data-testid='Pagination'
        className='usa-pagination'
      >
        {renderTitle()}
        <ul className='usa-pagination__list'>
          <li className='usa-pagination__item usa-pagination__arrow'>
            {currentPage !== 1 ? (
              <button
                data-testid='prev-button'
                type='button'
                className='usa-pagination__link usa-pagination__previous-page'
                aria-label='Go to Previous page'
                onClick={() => handlePrevClick()}
                onSubmit={() => handlePrevClick()}
              >
                <svg className='usa-icon' aria-hidden='true' role='img'>
                  <use href='/assets/img/sprite.svg#navigate_before' />
                </svg>

                <span role='presentation' className='usa-pagination__link-text'>
                  Previous
                </span>
              </button>
            ) : null}
          </li>
          {pageNumbers.map((number) => {
            if (number === currentPage) {
              return (
                <li
                  key={number}
                  className='usa-pagination__item usa-pagination__page-no'
                >
                  <button
                    data-testid='first-pagination'
                    type='button'
                    className='usa-pagination__button usa-current'
                    aria-label={
                      pageNumbers.length === number
                        ? `Page ${number}, Last Page`
                        : `Page ${number}`
                    }
                    aria-current='page'
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              );
            }
            if (
              number === currentPage + 1 ||
              number === currentPage - 1 ||
              (number < currentPage && number >= indexOfLastPage - 3)
            ) {
              return (
                <li
                  key={number}
                  className='usa-pagination__item usa-pagination__page-no'
                >
                  <button
                    type='button'
                    className='usa-pagination__button'
                    aria-label={
                      pageNumbers.length === number
                        ? `Go to Page ${number}, Last Page`
                        : `Go to Page ${number}`
                    }
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              );
            }

            return null;
          })}

          {currentPage < indexOfLastPage - 3 ? (
            <li
              className='usa-pagination__item usa-pagination__overflow'
              role='presentation'
            >
              <span> … </span>
            </li>
          ) : null}

          {pageNumbers.map((number) => {
            if (number >= indexOfLastPage - 1 && currentPage < number - 1) {
              return (
                <li
                  key={number}
                  className='usa-pagination__item usa-pagination__page-no'
                >
                  <button
                    data-testid='last-pagination'
                    type='button'
                    className='usa-pagination__button'
                    aria-label={
                      pageNumbers.length === number
                        ? `Go to Last Page ${number}`
                        : `Go to Page ${number}`
                    }
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              );
            }
            return null;
          })}
          <li className='usa-pagination__item usa-pagination__arrow'>
            {currentPage !== indexOfLastPage && indexOfLastPage > 0 ? (
              <button
                data-testid='next-button'
                type='button'
                className='usa-pagination__link usa-pagination__next-page'
                aria-label='Go to Next page'
                onClick={() => handleNextClick()}
                onSubmit={() => handleNextClick()}
              >
                <span role='presentation' className='usa-pagination__link-text'>
                  Next
                </span>

                <svg className='usa-icon' aria-hidden='true' role='img'>
                  <use href='/assets/img/sprite.svg#navigate_next' />
                </svg>
              </button>
            ) : null}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
