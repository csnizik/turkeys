import { useEffect } from 'react';
import { useAppDispatch } from '../../Redux/hooks/hooks';
import { setStaticText } from '../../Redux/Slice/staticTextSlice';
import { useGetConfigurationSettingsStaticTextQuery } from '../../Redux/services/api';
import './CPPEScoreLegend.scss'
import {CPPEScoreLegendData} from '../../common/typedconstants.common';
import CPPERow from '../CPPEScore/CPPERow';


const CPPEScoreLegend = (props) => {
    const dispatch = useAppDispatch();
    const uiText = useGetConfigurationSettingsStaticTextQuery(null, {
        pollingInterval: 900000,
    });

    useEffect(() => {
        if (uiText && uiText?.data != null) {
          dispatch(setStaticText(uiText));
        }
      }, [uiText]);

    const numbers = [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5];
    const ScoreBoxes: React.ReactElement[] = [];
    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];
        let className = '';
        let text = '';
        if (number > 0) {
            className = 'green-box';
            text = `+${number}`;
        }
        else if (number < 0) {
            className = 'red-box';
            text = number.toString();
        }
        else {
            className = 'white-box-gradient';
            text = number.toString();
        }
        const ScoreBox = <div className={className}>{text}</div>;
        ScoreBoxes.push(ScoreBox);
    }

    const description = ["Substantial Improvement", "Moderate Improvement", "Slight Improvement", "Slight Worsening", "Moderate Worsening", "Substantial Worsening"];
    const descriptionDivs: React.ReactElement[] = [];
    for (let i = 0; i < description.length; i++) {
        const des = description[i];

        const descriptionDiv = <p className={"description"}>{des}</p>;
        descriptionDivs.push(descriptionDiv);
    }

    return (
        <>
            <div className='top-title'>
                <a href={uiText.data.ConservationPracticePhysicalEffects.configurationValue}
                  target='_blank'
                  rel='noopener noreferrer'
              > <h2>{CPPEScoreLegendData.linklabel}
              <img  src={'../../../../images/arrow-up-right.svg'} alt="img" /></h2>
              </a>
                
            </div>
           
            <div className="Alert-container-box">
                <div className="fsa-alert fsa-alert--warning" role="alert">
                    <div className="fsa-alert__body">
                        <div className="warning-image">
                            <img src={'../../../../images/warning.png'} alt="img" />
                        </div>
                        <div className='disclaimer-section'>
                            <h3 className="fsa-alert__heading">Disclaimer</h3>
                            <p className="fsa-alert__text">
                             {CPPEScoreLegendData.disclaimer}
                            </p>
                            <p>{CPPERow}</p>   
                        </div>
                    </div>
                </div>
                <div className='boxes-container'>
                    <div className='boxes-subcontainer' >
                        {ScoreBoxes}

                    </div>
                </div>

                <div className='linear-scale' />

                <div className='end-container'>
                    <div className='end-subcontainer'>
                        {descriptionDivs}
                    </div>
                </div>
            </div>
        </>
    );
};
export default CPPEScoreLegend;
