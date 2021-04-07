import { useEffect, useState, useRef } from 'react';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Layer from "@arcgis/core/layers/Layer";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from '@arcgis/core/Graphic';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';
import Extent from '@arcgis/core/geometry/Extent'
import esriConfig from "@arcgis/core/config";
import "@arcgis/core/assets/esri/themes/light/main.css";
import '../stylesheets/map.css';
import {
  VIEW_DIV,
  MAP_ZOOM,
  CENTER_COORDINATES,
  statesLayerId,
  statesLayerName
} from '../common/constants.js'
import { queryLayer } from '../common/util/MapUtil';
import { usePrevious } from '../common/util/helperHooks';
//import { layer } from 'esri/views/3d/support/LayerPerformanceInfo';

import {IProject} from '../common/Types'


interface IMapProperties {
  searchText: string,
  setQueryResults: Function,
  setStateDropdownOption: Function,
  currentStateOption: string,
  queryResults: FeatureSet
}

// interface IRelatedTableResult {
//     results: FeatureSet
// }

interface MapProps {
  view: MapView;
  portalWebMap: WebMap;
}

const MapComponent = ({
    searchText,
    queryResults,
    setQueryResults,
    currentStateOption,
    setStateDropdownOption
  }: IMapProperties) => {
  const mapRef = useRef({} as MapProps);
  const [relatedTableResults, setRelatedTableResults] = useState<IProject[]>();
  const [view, setView] = useState(null);

  const previousSearchText = usePrevious(searchText);
  let statesLayer:Layer;

  let getProjectByState = function (state:Graphic, statesFLayer:FeatureLayer):any {
    let relID:number = state.getObjectId();
    let stateExtent:Extent = state.geometry.extent;
    statesFLayer = statesLayer as FeatureLayer;

    statesFLayer.queryRelatedFeatures({
      outFields: ["agreement_no_", 
                  "awardee_name", 
                  "project_title",
                  "funds_approved",
                  "awardee_state__territory",
                  "award_year",
                  "resource_concern__broad_",
                  "project_background",
                  "deliverables"],
      relationshipId: statesFLayer.relationships[0].id,
      objectIds: [relID]
    }).then((rdata) => {
      let projects:IProject[] = [];
      for(let feature  of rdata[relID].features){
          let project ={} as IProject;
          let feat = feature as Graphic;

          project.stateExtent = stateExtent;
          project.agreementNumber = feat.getAttribute("agreement_no_");
          project.awardeeName = feat.getAttribute("awardee_name");
          project.title = feat.getAttribute("project_title");
          project.funds = feat.getAttribute("funds_approved");
          project.state = feat.getAttribute("awardee_state__territory");
          project.year = feat.getAttribute("award_year");
          project.resource = feat.getAttribute("resource_concern__broad_");
          project.description = feat.getAttribute("project_background");
          project.deliverables = feat.getAttribute("deliverables");

          projects.push(project);
        }

        return projects;
    });
  }


  useEffect(() => {
    console.log("Hello")

  }, [view]);

  useEffect(() => {
    if (mapRef && mapRef.current) {
      esriConfig.portalUrl = `${process.env.REACT_APP_PORTAL_URL}`;
      const portalWebMap = new WebMap({
        portalItem: {
          id: process.env.REACT_APP_PORTAL_ID,
        },
      });

      const view = new MapView({
        map: portalWebMap,
        container: VIEW_DIV,
        center: CENTER_COORDINATES,
        zoom: MAP_ZOOM,
      });

      mapRef.current.view = view;
      mapRef.current.portalWebMap = portalWebMap;

      view.when(() => {
        view.on('pointer-up', function(event) {
          view.hitTest(event).then(function(response) {
          if (response.results.length) {
            const result = response.results[0];
            const graphic: any = result.graphic;
            const graphicAttributes = graphic.attributes;

            // Query stateLayer
            mapRef.current.portalWebMap.when(function(){
              statesLayer = mapRef.current.portalWebMap.findLayerById(statesLayerId);
              setStateDropdownOption(graphicAttributes.objectid_1);
              queryLayer(
                statesLayer,
                `objectid_1 = '${graphicAttributes.objectid_1}'`,
                [ "state_name", "state_abbr", "objectid_1", "no_farms07" ]
              )
              .then((data: any) => {
                setQueryResults(data)
              })
            });

          }
          })
        })
      })
    }
  }, [mapRef]);

  useEffect(() => {
    const currentView = mapRef.current.view;
    if (queryResults && queryResults.features && queryResults.features.length) {
      const state: any = queryResults.features[0];
      if (state) {
        currentView.when(() => {
          currentView.goTo(state);
          currentView.popup.open({
            features: [state],
            location: state.geometry.centroid
          });
        })
      }
    }
  }, [queryResults])

  useEffect(() => {
    if (relatedTableResults && relatedTableResults.length) {
      console.log(relatedTableResults);
    }
  }, [relatedTableResults])

  useEffect(() => {
    if (searchText && previousSearchText !== searchText && !currentStateOption) {

      let statesFLayer:FeatureLayer;

      mapRef.current.portalWebMap.when(function(){

        statesLayer = mapRef.current.portalWebMap.findLayerById(statesLayerId);
        queryLayer(
          statesLayer,
          `state_name LIKE '${searchText}%'`,
          [ "state_name", "state_abbr", "objectid_1", "no_farms07" ]
        )
        .then((states: FeatureSet) => {
          setQueryResults(states);

          let stateExtent:Extent;

          if (states.features && states.features.length == 1){
            const proj:IProject[] = getProjectByState(states.features[0],statesFLayer )
            
              setRelatedTableResults(proj);
            }
          
        });

       });

    }

    if (currentStateOption) {
      mapRef.current.portalWebMap.when(function(){
        statesLayer = mapRef.current.portalWebMap.findLayerById(statesLayerId);

        queryLayer(
          statesLayer,
          `objectid_1 = '${currentStateOption}'`,
          [ "state_name", "state_abbr", "objectid_1", "no_farms07" ]
        )
        .then((data: any) => setQueryResults(data))
      });
    }
  }, [searchText, currentStateOption])

  return null;
}

export default MapComponent;
