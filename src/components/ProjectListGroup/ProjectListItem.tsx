import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../Redux/hooks/hooks';

const ProjectListItem = ({
  id,
  title,
  owner,
  statesInvolved,
  year,
  description,
  link,
}: any) => {
  const { t } = useTranslation();
  const history: any = useHistory();
  const stateCode = useAppSelector((state) => state?.stateSlice?.stateCode);
  //Pushes you to specific initiative pages under Initiative tab (2) in projects and initiatives
  const handleClick = () => {
    history.push(`/${stateCode}/ProjectsAndInitiatives/2/${id}`);
  };

  const renderProjectDetails = (
    projectOwner: string,
    states: any,
    projectYear: string
  ) => {
    const getStates = states.length > 1 ? states.join(', ') : states[0];

    return (
      <div className='outer-box'>
        <div className='project-details'>
          <span>{projectOwner}</span>
          <span>{getStates}</span>
          <span>{projectYear}</span>
        </div>
      </div>
    );
  };
  if (statesInvolved) {
    return (
      <div key={id} className='list-group-item'>
        <p>{title}</p>
        {owner && renderProjectDetails(owner, statesInvolved, year)}
        <p>{description}</p>
        <p className='link-text'>
          <a href={link} target='_blank' rel='noreferrer'>
            {t('associated-projects-initiatives.link')}
            <img
              src={'../../../../images/arrow-up-right.svg'}
              alt='img'
              width={15}
              height={15}
            />
          </a>
          <i className='fa fa-external-link' aria-hidden='true' />
        </p>
      </div>
    );
  }
  return (
    <div key={id} className='list-group-item'>
      <p>
        <button
          onClick={handleClick}
          type='button'
          className='internal-title-link'
        >
          {title}
        </button>
      </p>
      {owner && renderProjectDetails(owner, statesInvolved, year)}
      <p>{description}</p>
    </div>
  );
};

export default ProjectListItem;
