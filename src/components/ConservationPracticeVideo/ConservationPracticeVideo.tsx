import './conservation-practice-video.scss';
import { useGetPracticeVideoLinkQuery } from '../../Redux/services/api';
import Spinner from '../Spinner/Spinner';
import { useAppSelector } from '../../Redux/hooks/hooks';

const ConservationPracticeVideo = ({ selectedPracticeId }: any) => {
  const { data, error, isLoading, isSuccess, isError } =
    useGetPracticeVideoLinkQuery(selectedPracticeId);

  const fromPdfReport = useAppSelector(
    (state) => state?.pdfGenSlice?.enablePdfGen
  );

  return (
    <section className='media-box' data-testid='video-box-container'>
      {isLoading && <Spinner />}
      {isError && error}
      {isSuccess && data && data[0]?.videoLink?.length > 0 && (
        <div className={fromPdfReport ? 'pdf-content' : 'content'}>
          <h2>{data[0].videoName}</h2>
          <div className='full-component'>
            <div className='video-media' data-testid='video-media'>
              {!fromPdfReport && (
                <iframe
                  className='video'
                  src={data[0].videoLink}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; X-Frame-Options'
                  allowFullScreen
                  title={`${data[0].videoName} Embedded Video`}
                  aria-hidden='true'
                />
              )}
              {fromPdfReport && (
                <a
                  href={data[0].videoLink}
                  className='video-outer-link'
                  aria-label={`${data[0].videoName} Video Link`}
                >
                  <iframe
                    name='iframeVideo'
                    className='videoImg'
                    src={data[0].videoLink}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; X-Frame-Options'
                    allowFullScreen
                    title={`${data[0].videoName} Embedded Video`}
                  />
                </a>
              )}
            </div>
            <div className='video-description'>
              <p className='description'>{data[0].videoDescription}</p>
              <div className='link'>
                <a
                  href='https://www.farmers.gov/conservation/conservation-at-work/all'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  All Conservation at Work videos{' '}
                  <img
                    alt='All Conservation at Work videos open in a new tab'
                    // eslint-disable-next-line global-require
                    src={require('./image/newLinkIcon.svg').default}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConservationPracticeVideo;
