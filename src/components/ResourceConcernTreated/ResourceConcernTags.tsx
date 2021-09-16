import { useEffect, useState } from 'react';
import './resource-concern-treated.scss';

const ResourceConcernTags = ( category : any) => {
    const ct = category;
    const [dataSet, setDataSet] = useState(new Set());

    const populateDataset = () => {
      const tempSet= new Set();
      let i=0;
      for(;i<ct.category.length;i++){
        tempSet.add(ct.category[i].landUseName)
      }
      setDataSet(tempSet)
    }

    useEffect(() => {
      populateDataset();
    }, []);

    return (
      <div className='content-tag'>
        <div className='tags'>
          <img 
            className={ dataSet.has('Crop')? 'displaying-image' : 'hidden-image'}
            alt='Cropland Icon'
            // eslint-disable-next-line global-require
            src={require('./image/Cropland-IconPlaceholder.svg').default}
          />
          <img 
            className={ dataSet.has('Urban')? 'displaying-image' : 'hidden-image'}
            alt='Developedland Icon'
            // eslint-disable-next-line global-require
            src={require('./image/DevelopedLand-and-UrbanAg-IconPlaceholder.svg').default}
          />
          <img 
            className={ dataSet.has('Forest')? 'displaying-image' : 'hidden-image'}
            alt='Forestland Icon'
            // eslint-disable-next-line global-require
            src={require('./image/Forestland-IconPlaceholder.svg').default}
          />
          <img 
            className={ dataSet.has('Rural')? 'displaying-image' : 'hidden-image'}
            alt='Other farms and Rural land Icon'
            // eslint-disable-next-line global-require
            src={require('./image/OtherFarm-and-RuralLand-IconPlaceholder.svg').default}
          />
          <img 
            className={ dataSet.has('Pasture')? 'displaying-image' : 'hidden-image'}
            alt='Pasture Icon'
            // eslint-disable-next-line global-require
            src={require('./image/Pasture-IconPlaceholder.svg').default}
          />
        </div>
      </div>
    );
}

export default ResourceConcernTags;