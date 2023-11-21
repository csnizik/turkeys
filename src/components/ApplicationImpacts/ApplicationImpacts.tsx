import './application-impacts.scss';

interface IApplicationImpactProps {
  isSuccess: boolean;
  data: any;
}

const intro: string =
  'NRCS engages in ongoing efforts to assess the impacts of conservation practices applied and to develop tools that can be used by planners and landowners to make more informed planning and management decisions. The information gathered about actual or estimated impacts of practices and programs on the ground helps improve the effectiveness of conservation program design and delivery.';

const ApplicationImpacts = ({ data, isSuccess }: IApplicationImpactProps) => {
  const getHeaderText = () => {
    const practiceName = (data && data?.practiceName) || '';
    if (practiceName) {
      return `Impacts of Applying ${practiceName} in Nationally`;
    }
    return practiceName;
  };

  if (!isSuccess) return null;

  return (
    <div
      className='app-impact-parent'
      data-testid='app-impact'
      id='ImpactsPractice'
    >
      <h2>{getHeaderText()}</h2>
      <h4>{intro}</h4>
    </div>
  );
};

export default ApplicationImpacts;
