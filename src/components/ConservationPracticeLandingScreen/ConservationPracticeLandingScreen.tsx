import { useEffect, useRef, useState } from 'react';
import { getRequest } from '../../common/util/AxiosUtil';
import { setPracticeCategory } from '../../Redux/Slice/practiceSlice';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks/hooks';
import ConservationPracticeIntroduction from '../ConservationPracticeIntroduction';
import ConservationPracticesCategories from '../ConservationPracticesCategories';
import './conservation-landing-screen.scss';

const ConservationPracticeLandingScreen = ({
  setPracticeViewType,
  stateCode,
}: any) => {
  const [categories, setCategories] = useState([]);
  const mountedRef = useRef(true);
  const uiText = useAppSelector(
    (state) => (state?.staticTextSlice?.staticData as any)?.data
  );
  const dispatch = useAppDispatch();

  const selectPractice = (practiceCategoryId) => {
    dispatch(setPracticeCategory(practiceCategoryId));
    setPracticeViewType({
      allPractices: false,
      practiceCategories: true,
      individualPractice: false,
    });
  };

  const getPractices = async () => {
    try {
      let code: any = stateCode.toString();
      code = code.length === 1 ? `0${code}` : code;
      const response: any = (await getRequest(
        `/practice/category/${code}`
      )) || { data: [] };
      if (!mountedRef.current) return null;
      setCategories(response.data);
    } catch (error) {
      // throw new Error('practice categories Request Error');
    }
    return null;
  };

  useEffect(() => {
    getPractices();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div data-testid='conserv-prac-land-screen'>
      <ConservationPracticeIntroduction
        introductionParagraph={uiText?.cp_paragraph_1?.configurationValue}
        introductionParagraph2={uiText?.cp_paragraph_2?.configurationValue}
        title={uiText?.cpCategoryHeading?.configurationValue}
       />
       <div className='landing-screen-categories'>
         <ConservationPracticesCategories
           selectPractice={selectPractice}
           categories={categories}
           heading={uiText?.cpCategoryHeadingSubHeading?.configurationValue}
           intro={
           uiText?.cpCategoryHeadingSubHeadingDescription?.configurationValue
           }
         /> 
       </div>
    </div>
  );
};

export default ConservationPracticeLandingScreen;
