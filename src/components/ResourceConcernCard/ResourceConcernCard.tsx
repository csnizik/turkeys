import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../Redux/hooks/hooks';
import { useGetResourceConcernQuery } from '../../Redux/services/api';
import './resource-concern-card.scss';
import Spinner from '../Spinner/Spinner';
import {
  setSpecificResourceConcern,
  setResourceConcernCategory,
} from '../../Redux/Slice/resourceConcernSlice';

const ResourceConcernCardDetails = ({ setResourceConcernViewType }: any) => {
  
  const dispatch = useAppDispatch();

  const { stateCode, category: selectedResourceConcernCategoryId }: any = useParams();

  const [resourceconcernstate, setResourceConcernstate] = useState(0);

  const history = useHistory();
  const { category }: any = useParams();

  const handleChange = (resourceConcernId: number, resourceConcernCategoryId: number) => {
    dispatch(setSpecificResourceConcern(resourceConcernId));
    dispatch(setResourceConcernCategory(resourceConcernCategoryId));
    history?.push(`${category}/${resourceConcernId}`);
    setResourceConcernViewType({
      allResourceConcerns: false,
      resourceConcernCategories: false,
      individualResourceConcern: true,
    });
  };

  useEffect(() => {
    setResourceConcernstate(+selectedResourceConcernCategoryId);
  }, []);

  useEffect(() => {
    setResourceConcernstate(+selectedResourceConcernCategoryId);
  }, [selectedResourceConcernCategoryId]);

  const { data, error, isLoading, isSuccess, isError } = 
  useGetResourceConcernQuery(resourceconcernstate);
  const resourceConcernCategory: any = data;


  return (
    <div className='heading' data-testid='ResourceConcern-Card'>
      {resourceConcernCategory?.length !== 1 ? (
        <h2>{resourceConcernCategory?.length} Resource Concerns</h2>
      ) : (
        <h2>{resourceConcernCategory?.length} Resource Concern</h2>
      )}
      {isLoading && <Spinner />}
      {isError && error}
      {isSuccess && data && (
        <>
          {resourceConcernCategory
            ? // eslint-disable-next-line
              resourceConcernCategory.map((resourceConcern: any) => {
                const imageName = resourceConcern?.resourceConcernImagePath || 'default.jpg';
                return (
                  <div className='full-document-box' data-testid='ResourceConcern-box'>
                    <div className='list-box'>
                      <div className='info-box'>
                        <button
                          type='button'
                          aria-label={resourceConcern.resourceConcernName}
                          onClick={() =>
                            handleChange(
                              resourceConcern.resourceConcernId,
                              selectedResourceConcernCategoryId
                            )
                          }
                        >
                          <h3 className='card-titles'>
                            {resourceConcern.resourceConcernName}
                          </h3>
                        </button>
                        <p>{resourceConcern.resourceConcernDescription}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            : []}
        </>
      )}
    </div>
  );
};

export default ResourceConcernCardDetails;
