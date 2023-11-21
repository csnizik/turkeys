import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../Redux/hooks/hooks';
import { useGetPaymentScheduleLinksQuery } from '../../Redux/services/api';
import Spinner from '../Spinner/Spinner';
import './implementation-extent.scss';
import image from './image/newLinkIcon.svg';
import PracticeDetailReport from '../TableauReport/PracticeDetailReport';
import EquipPracticeCertificationTrend from '../TableauReport/EquipPracticeCertificationTrend';
import { eipcTabStatus, pdTabStatus } from '../../Redux/Slice/pdfGenSlice';

interface IImplementationExtentProps {
  data: any;
  isSuccess: boolean;
  isPdFromRPEmpty?: boolean;
  isEipcFromRPEmpty?: boolean;
}

const ImplementationExtent = ({
  data,
  isSuccess,
  isPdFromRPEmpty,
  isEipcFromRPEmpty,
}: IImplementationExtentProps) => {
  const stateInfo = useAppSelector((state: any) => state?.stateSlice);
  const [isPdTableauEmpty, setIsPdTableauEmpty] = useState(false);
  const [isEipcTableauEmpty, setIsEipcTableauEmpty] = useState(false);
  const practiceName = (data && data.practiceName) || '';

  const dispatch = useAppDispatch();
  const results = useGetPaymentScheduleLinksQuery(stateInfo?.stateCode);
  const data2 = results.data || [];
  const error2 = results.error;
  const isLoading2 = results.isLoading;
  const isSuccess2 = results.isSuccess;
  const isError2 = results.isError;
  const scheduleLink: any = data2[0]?.paymentLink || '';

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );

  const getHeaderText = () => {
    if (practiceName) {
      return stateInfo?.stateNameDisplay === 'National'
        ? `National ${uiText?.cpDetailHeadingSupport?.configurationValue} for the ${practiceName} Practice`
        : `${uiText?.cpDetailHeadingSupport?.configurationValue} for the ${practiceName} Practice in ${stateInfo?.stateNameDisplay}`;
    }
    return practiceName;
  };

  useEffect(() => {
    if (!isPdFromRPEmpty) dispatch(pdTabStatus(isPdTableauEmpty));
  }, [isPdTableauEmpty]);

  useEffect(() => {
    if (!isEipcFromRPEmpty) dispatch(eipcTabStatus(isEipcTableauEmpty));
  }, [isEipcTableauEmpty]);

  const renderObligations = () => {
    if (isEipcTableauEmpty || isEipcFromRPEmpty) return null;
    return (
      <div className='obligations'>
        <h3>Obligations and Practices Implemented</h3>
        <hr />
        <div className='graph-container'>
          <div className='obligation-graph'>
            <EquipPracticeCertificationTrend
              practiceCode={data?.practiceCode}
              checkTableauIsEmpty={setIsEipcTableauEmpty}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAcresImplemented = () => {
    if (isPdTableauEmpty || isPdFromRPEmpty) return null;
    return (
      <div className='arces-implemented'>
        <h3>Acres Receiving Conservation</h3>
        <hr />
        <div className='graph-container'>
          <div className='acres-graph'>
            <PracticeDetailReport
              practiceCode={data.practiceCode}
              checkTableauIsEmpty={setIsPdTableauEmpty}
            />
          </div>
          <div className='link'>
            <Link
              aria-label='Explore more data on acres receiving conservation at the RCA Data
              Viewer opens in a new browser tab'
              style={{
                textDecoration: 'none',
              }}
              to={{
                pathname:
                  'https://www.nrcs.usda.gov/Internet/NRCS_RCA/reports/data_viewer_home.html',
              }}
              target='_blank'
            >
              Explore more data on acres receiving conservation at the RCA Data
              Viewer
              <img
                alt='Explore more data on acres receiving conservation at the RCA Data
                Viewer opens in a new browser tab'
                src={image}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentScheduleLink = () => {
    const selectedLocation =
      stateInfo.stateCode === '00'
        ? 'Current State Payment Schedules | NRCS'
        : `Current ${stateInfo?.stateNameDisplay} Payment Schedules | NRCS`;
    return (
      <div className='payment-schedule'>
        <h3 id='payment-title'>
          {uiText?.cpDetailHeadingSupportSubheading?.configurationValue}
        </h3>
        <p>
          {
            uiText?.cpDetailHeadingSupportSubheadingDescription
              ?.configurationValue
          }
        </p>
        <div className='link'>
          <a
            href={scheduleLink}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${selectedLocation} opens in a new browser tab`}
          >
            {selectedLocation}
            <img
              alt={`${selectedLocation} opens in a new browser tab`}
              src={image}
            />
          </a>
        </div>
      </div>
    );
  };

  if (!isSuccess) return null;

  return (
    <div className='ie-parent' id='SupportPractice' data-testid='i-extent'>
      <h2>{getHeaderText()}</h2>
      <p>{uiText?.cpDetailHeadingSupportDescription?.configurationValue}</p>
      <div className='extent-content'>
        {renderObligations()}
        {renderAcresImplemented()}
        <>
          {isLoading2 && <Spinner />}
          {isError2 && error2}
          {isSuccess2 && data2.length > 0 && renderPaymentScheduleLink()}
        </>
      </div>
    </div>
  );
};

export default ImplementationExtent;

ImplementationExtent.defaultProps = {
  isPdFromRPEmpty: false,
  isEipcFromRPEmpty: false,
};
