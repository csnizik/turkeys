import './cppe-score.scss';
import { useGetNegativeCPPEPracticeQuery } from '../../Redux/services/api';
import CPPECautionEntry from './CPPECautionEntry';

const CPPECaution = ({ practiceCode }: { practiceCode: string }) => {
  const { data } = useGetNegativeCPPEPracticeQuery(practiceCode);

  return (
    <div className='caution-container'>
      <h2>
        <img src='../../../../images/ic_error_24px.svg' alt='Warning' /> Caution
        for application{' '}
      </h2>
      <p>
        This practice has a negative effect on the following resource concerns:{' '}
      </p>
      {data !== undefined && (
        <ul>
          {data.map((practice) => (
            <CPPECautionEntry
              key={`${practice.practiceCode}-${practice.resourceConcernId}`}
              practice={practice}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CPPECaution;
