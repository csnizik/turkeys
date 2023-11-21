import { Link, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query/react';
import {
  useGetAssociatedPracticeQuery,
  useGetConfigurationSettingsQuery,
  useGetFotgFolderUrlQuery,
} from '../../Redux/services/api';
import './specs.scss';
import { IAssociatedPracticeList } from '../../common/types';
import { useAppSelector } from '../../Redux/hooks/hooks';
import outerLinkImage from './image/newLinkIcon.svg';
import { practiceStandardGuideLink } from '../../common/typedconstants.common';

interface ISpecAndToolsProps {
  data: any;
  isSuccess: boolean;
  selectedStateCode: string;
  selectedPracticeId: number;
}

const SpecificationsAndTools = ({
  data,
  isSuccess,
  selectedStateCode,
  selectedPracticeId,
}: ISpecAndToolsProps) => {
  const userSelectedFilter = {
    stateCode: selectedStateCode,
    practiceId: selectedPracticeId,
  };
  const { name }: any = useParams();

  const selectedStateName = useAppSelector(
    (state) => state?.stateSlice?.stateNameDisplay
  );
  const selectedStateAbbr = useAppSelector(
    (state) => state?.stateSlice?.stateAbbreviation
  );
  const fromPdfReport = useAppSelector(
    (state) => state?.pdfGenSlice?.enablePdfGen
  );

  const uiText: any = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  ); 

  const fotgLink = useGetConfigurationSettingsQuery(
    'fotg_practice_deeplink_webservice'
  );
  const fotgLinkData = fotgLink.data || [];
  const fotgWebServiceLink: any = fotgLinkData[0]?.configurationValue || '';

  //this method adjusts the state code to be what the FOTG endpoint expects to see for the
  //listed territories. Currently it is hardcoded not best practice.
  const calculateAdjustedStateCode = () => {
    //Maryland, and DC
    if (selectedStateCode === '11' || selectedStateCode === '24') {
      return 'MW';
    }
    //Carribean Region Territories
    // eslint-disable-next-line
    else if (selectedStateCode === '72' || selectedStateCode === '78') {
      return 'CR';
    }
    //Pacific Basin territories: HI, AS, FM, GU, MH, MP, PW
    else if (
      selectedStateCode === '60' ||
      selectedStateCode === '64' ||
      selectedStateCode === '66' ||
      selectedStateCode === '68' ||
      selectedStateCode === '69' ||
      selectedStateCode === '70' ||
      selectedStateCode === '74'
    ) {
      return '15';
    }
    return selectedStateCode;
  };

  const fotgInfo = {
    practiceCode: data?.practiceCode,
    stateCode: calculateAdjustedStateCode(),
    fotgLink: fotgWebServiceLink,
  };

  const fotgFolderLink = useGetFotgFolderUrlQuery(
    fotgLink.isSuccess ? fotgInfo : skipToken
  );
  const fotgFolderURL = fotgFolderLink?.data?.folder_url;

  const content = useGetAssociatedPracticeQuery(userSelectedFilter);

  const getHeaderText = () => {
    const practiceName = (data && data?.practiceName) || '';
    if (practiceName) {
      return `${practiceName} ${uiText?.cpDetailHeadingTools?.configurationValue}`;
    }
    return practiceName;
  };

  const renderNationalSpecs = () => {
    return (
      <div
        className='state-specific-container'
        data-testid='national-specifications'
      >
        <h3>{uiText?.cpDetailHeadingToolsSubheading?.configurationValue}</h3>
        <p className='state-prompt-text'>{uiText?.cpDetailHeadingToolsSubheadingDescriptionUS?.configurationValue}</p>
        <div className='link'>
          <a
            href='https://www.nrcs.usda.gov/wps/portal/nrcs/detailfull/national/technical/cp/ncps/?cid=nrcs143_026849'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='NRCS National Conservation Practice Guidance opens in a new browser tab'
          >
            NRCS National Conservation Practice Guidance
            <img
              alt='NRCS National Conservation Practice Guidance opens in a new browser tab'
              src={outerLinkImage}
            />
          </a>
        </div>
      </div>
    );
  };

  const renderStateSpecs = () => {
    return (
      <div
        className='state-specific-container'
        data-testid='state-specifications'
      >
        <h3>{selectedStateName} Specifications</h3>
        <p className='state-prompt-text'>{uiText?.cpDetailHeadingToolsSubheadingDescriptionState?.configurationValue}</p>
        <div className='link'>
          <a
            href={
              fotgFolderLink.isSuccess && fotgFolderURL !== null
                ? fotgFolderURL
                : `${practiceStandardGuideLink.viewStateConservationPracticeLink}${selectedStateAbbr}`
            }
            target='_blank'
            rel='noopener noreferrer'
            aria-label={`${
              fromPdfReport
                ? practiceStandardGuideLink.pdfReportPromptText
                : practiceStandardGuideLink.webpagePromptText
            } opens in a new browser tab`}
          >
            {fromPdfReport
              ? practiceStandardGuideLink.pdfReportPromptText
              : practiceStandardGuideLink.webpagePromptText}
            <img
              alt={`${
                fromPdfReport
                  ? practiceStandardGuideLink.pdfReportPromptText
                  : practiceStandardGuideLink.webpagePromptText
              } opens in a new browser tab`}
              src={outerLinkImage}
            />
          </a>
        </div>
      </div>
    );
  };

  const renderAssociatedPractice = () => {
    return (
      <div className='associated-prac' data-testid='associated-practice'>
        <h3>{uiText?.cpDetailHeadingToolsSubheading2?.configurationValue}</h3>
        <p>{uiText?.cpDetailHeadingToolsSubheading2Description?.configurationValue}</p>
        <ul className='practices-row' data-testid='associated-practice-links'>
          {content.data?.map((practice: IAssociatedPracticeList) => {
            return (
              <li key={practice.practiceId} className='grid-col-6'>
                <Link
                  to={`/${selectedStateCode}/${name}/${practice.practiceCategoryId}/${practice.practiceId}`}
                  target='_blank'
                  aria-label={`${practice.practiceName} practiceCode ${practice.practiceCode} opens a new browser tab`}
                >
                  {practice.practiceName}
                </Link>
                &ensp;({practice.practiceCode})
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  if (!isSuccess) return null;

  return (
    <section
      className='st-parent'
      data-testid='practice-spec'
      id='PracticeSpecifications'
    >
      <h2>{getHeaderText()}</h2>
      <p>{uiText?.cpDetailHeadingToolsDescription?.configurationValue}</p>
      {renderNationalSpecs()}
      {selectedStateName === 'National' ? null : renderStateSpecs()}
      {content?.data?.length ? renderAssociatedPractice() : null}
    </section>
  );
};

export default SpecificationsAndTools;
