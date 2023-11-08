"use strict";(self.webpackChunk_farmos_org_farmos_map=self.webpackChunk_farmos_org_farmos_map||[]).push([[663],{2390:(t,e,i)=>{var n=i(7182),r=i(9271),s=i(933),a=i(8641),o=i(7580),d=i(2290),c=i(1090),h=i(6528);function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var u=l(n),g=l(r),p=l(s),m=l(c);const f=[0,0];class S extends u.default{constructor(t){const e=t||{};super(e),this.originCoordinate=e.originCoordinate||f,this.rotationAnchorCoordinate=e.rotationAnchorCoordinate||null,this.xGridSize=e.xGridSize||10,this.yGridSize=e.yGridSize||10,this.maxPointsPerSide=e.maxPointsPerSide||64,this.overlay_=new g.default({source:E(),style:e.style,updateWhileInteracting:!0}),this.gridFeature_=new m.default({geometry:new h.MultiPoint([])}),this.updateGridDescription_(),this.overlay_.getSource().addFeature(this.gridFeature_),this.overlay_.on("postrender",this.handleGridLayerPostRender_.bind(this)),this.addEventListener("change:active",this.updateState_)}getGridFeature(){return this.gridFeature_}setOriginPoint(t){this.originCoordinate=t,this.updateGridDescription_()}setRotationControlPoint(t){this.rotationAnchorCoordinate=t,this.updateGridDescription_()}setXGridSize(t){this.xGridSize=t,this.updateGridDescription_()}setYGridSize(t){this.yGridSize=t,this.updateGridDescription_()}setMaxPointsPerSide(t){this.maxPointsPerSide=t,this.changed()}setStyle(t){this.overlay_.setStyle(t)}setMap(t){super.setMap(t),this.updateState_()}updateState_(){const t=this.getMap(),e=this.getActive();this.overlay_.setMap(e?t:null),this.updateGridDescription_()}updateGridDescription_(){const t=this.getMap();if(!(t&&this.originCoordinate&&this.xGridSize&&this.yGridSize&&this.getActive()))return this.gridDescription_=null,this.lastGridDescription_=null,this.gridFeature_.getGeometry().setCoordinates([]),void this.changed();const e=t.getView().getProjection(),i=d.transform(this.originCoordinate,e,"EPSG:4326"),n=this.rotationAnchorCoordinate||C(this.originCoordinate,[1,0]),r=d.transform(n,e,"EPSG:4326"),s=[i[0],r[1]],a=[r[0],i[1]],c=o.getDistance(i,r);let h=o.getDistance(i,s),l=o.getDistance(i,a);i[0]>r[0]&&(l*=-1),i[1]>r[1]&&(h*=-1);const u=h/c,g=l/c;this.gridDescription_,this.gridDescription_={originCoordinate:this.originCoordinate,riseFactor:u,runFactor:g,xDim:this.xGridSize,yDim:this.yGridSize},this.changed()}changed(){super.changed(),this.overlay_.changed()}handleGridLayerPostRender_(t){const e=this.getMap(),i=this.gridDescription_;if(!i)return;const n=e.getView().calculateExtent(e.getSize()),r=i===this.lastGridDescription_||JSON.stringify(i)===JSON.stringify(this.lastGridDescription_),s=n===this.lastViewExtent_||JSON.stringify(n)===JSON.stringify(this.lastViewExtent_);if(r&&s)return;const o=i.originCoordinate;let d=[i.xDim*i.runFactor,i.xDim*i.riseFactor],c=[-1*i.yDim*i.riseFactor,i.yDim*i.runFactor];const l=this.calculateLocalSphereNormalizationCoefficients(new h.Point(i.originCoordinate));d=M(d,l),c=M(c,l);const u=C(o,v([d,c],w(o,d,c,a.getCenter(n)))),g=new h.Point(u),p=function(t,e,i,n){return[w(t,e,i,[n[0],n[1]],Math.ceil),w(t,e,i,[n[2],n[3]],Math.ceil),w(t,e,i,[n[0],n[3]],Math.ceil),w(t,e,i,[n[2],n[1]],Math.ceil)]}(u,d,c,n),m=function(t,e,i,n,r,s){const a=i[0][0],o=i[0][1],d=i[1][0],c=i[1][1],h=i[2][0],l=i[2][1],u=i[3][0],g=i[3][1],p=Math.min(a,d,h,u),m=Math.min(o,c,l,g),f=Math.max(a,d,h,u),S=Math.max(o,c,l,g),v=f-p,C=S-m,y=Math.max(1,Math.floor(v/s)),M=Math.max(1,Math.floor(C/s)),w=[];for(let i=p;i<=f;i+=y)for(let s=m;s<=S;s+=M){const a=I(e,i,s,n,r);a.intersectsExtent(t)&&w.push(a.getCoordinates())}return w}(n,g,p,d,c,this.maxPointsPerSide);this.lastGridDescription_=i,this.lastViewExtent_=n,this.gridFeature_.getGeometry().setCoordinates(m)}calculateLocalSphereNormalizationCoefficients(t){const e=this.getMap().getView().getProjection().getCode();function i(t){return t.transform(e,"EPSG:4326").getCoordinates()}function n(t,e,i){const n=t.clone();return n.translate(e,i),n}const r=i(t.clone()),s=i(n(t,1,0)),a=i(n(t,0,1));return[1/o.getDistance(r,s),1/o.getDistance(r,a)]}}function I(t,e,i,n,r){const s=y(n,e),a=y(r,i),o=t.clone();return o.setCoordinates(C(t.getCoordinates(),s,a)),o}function v(t,e){const i=t[0][0],n=t[0][1],r=t[1][0],s=t[1][1],a=e[0],o=e[1];return[i*a+r*o,n*a+s*o]}function C(t,e,i){return i?[t[0]+e[0]+i[0],t[1]+e[1]+i[1]]:[t[0]+e[0],t[1]+e[1]]}function y(t,e){return[t[0]*e,t[1]*e]}function M(t,e){return[t[0]*e[0],t[1]*e[1]]}function w(t,e,i,n,r){var s,a;return function(t,e,i,n){const r=n||Math.round,s=function(t,e,i){return v(function(t){const e=t[0][0],i=t[0][1],n=t[1][0],r=t[1][1],s=e*r-i*n;return[[r/s,-i/s],[-n/s,e/s]]}([t,e]),i)}(t,e,i);return[r(s[0]),r(s[1])]}(e,i,(a=t,[(s=n)[0]-a[0],s[1]-a[1]]),r)}function E(){const t=new p.default({useSpatialIndex:!1,features:[],wrapX:!1});return t.getFeaturesInExtent=t.getFeatures,t}t.exports=S},9899:(t,e,i)=>{i.r(e),i.d(e,{default:()=>C});var n=i(8714),r=i(8775),s=i(5010),a=i(6002),o=i(245),d=i(5487),c=i(7539),h=i(283),l=i(1345),u=i(8958),g=i(9271),p=i(933),m=i(2390),f=i.n(m),S=i(7673);class I extends r.default{constructor(t){const e=t||{};super({element:document.createElement("div"),target:e.target});const i=this,r="ol-snapgrid",{element:s}=this;function m(t,e,n){const a=document.createElement(t);a.className=`${r} ${e}`,n.call(i,a),i.innerControlElements[e]=a,s.appendChild(a)}s.className=`${r} collapsed ${o.XV} ${o.hg}`,this.innerControlElements={},m("button","activateButton",(t=>{t.innerHTML="#",t.title="Enable the Snapping Grid",t.type="button",t.addEventListener(d.Z.CLICK,this.handleActivateButtonClick.bind(this),!1)})),m("input","xInput",(t=>{t.value=5,t.type="number",t.step="any",t.classList.add("collabsible"),t.addEventListener("input",i.handleXInputChanged.bind(this),!1)})),m("span","timesSymbol",(t=>{t.innerHTML="x",t.classList.add("collabsible")})),m("input","yInput",(t=>{t.value=5,t.type="number",t.step="any",t.classList.add("collabsible"),t.addEventListener("input",i.handleYInputChanged.bind(this),!1)})),m("select","unitSelector",(t=>{function n(e,i){const n=document.createElement("option");n.innerHTML=e,n.value=e,n.selected=i,t.appendChild(n)}n("m"),n("ft"),n("in"),t.value="us"===e.units?"ft":"m",t.classList.add("collabsible"),t.addEventListener("change",i.handleUnitsChanged.bind(this),!1)})),this.gridPointStyle=new c.default({image:new h.Z({radius:1,fill:new l.Z({color:"white"}),stroke:new u.Z({color:"green",width:1})})}),this.gridControlPointsVectorLayer=new g.default({source:new p.default({features:[],wrapX:!1})}),this.gridControlPointsVectorLayer.getSource().on("addfeature",this.handleAddGridControlFeature.bind(this)),document.addEventListener(d.Z.KEYDOWN,this.handleEscape.bind(this),!1),this.grid=new(f())({xGridSize:this.getXDim(),yGridSize:this.getYDim(),style:this.gridPointStyle}),this.gridSnapInteraction=new a.Z({features:new n.Z,pixelTolerance:15}),this.gridSnapInteraction.addFeature(this.grid.getGridFeature()),this.grid.setActive(!1),this.mouseIsOver=!1,s.addEventListener("mouseenter",i.handleMouseEnter.bind(this),!1),s.addEventListener("mouseleave",i.handleMouseLeave.bind(this),!1),this.innerControlElements.xInput.addEventListener("blur",this.handleControlElementBlur.bind(this),!1),this.innerControlElements.yInput.addEventListener("blur",this.handleControlElementBlur.bind(this),!1),this.innerControlElements.unitSelector.addEventListener("blur",this.handleControlElementBlur.bind(this),!1)}handleMouseEnter(){this.mouseIsOver=!0,this.element.classList.remove("collapsed")}handleMouseLeave(){this.mouseIsOver=!1,document.activeElement!==this.innerControlElements.xInput&&document.activeElement!==this.innerControlElements.yInput&&document.activeElement!==this.innerControlElements.unitSelector&&this.element.classList.add("collapsed")}handleControlElementBlur(){this.mouseIsOver||this.element.classList.add("collapsed")}setMap(t){const e=this.getMap();if(t===e)return;let i=!1;if(e&&(e.removeLayer(this.gridControlPointsVectorLayer),this.drawSnappingOriginsInteraction&&this.resetDrawInteraction(),this.getMap().removeInteraction(this.gridSnapInteraction),i=this.grid.getActive(),i&&e.removeInteraction(this.grid),this.onMapAddInteraction&&(e.getInteractions().un("add",this.onMapAddInteraction.listener),this.onMapAddInteraction=null),this.onMapRemoveInteraction&&(e.getInteractions().un("remove",this.onMapRemoveInteraction.listener),this.onMapRemoveInteraction=null)),super.setMap(t),t){t.addLayer(this.gridControlPointsVectorLayer);const e=()=>{const t=this.mapHasOtherDrawInteractions(),e=this.getMap().getInteractions().getArray(),i=e.some((t=>t===this.drawSnappingOriginsInteraction)),n=e.some((t=>t===this.grid));t&&i&&this.resetDrawInteraction(),i||n?(this.element.classList.add("active"),this.innerControlElements.activateButton.title="Disable the Snapping Grid"):(this.element.classList.remove("active"),this.innerControlElements.activateButton.title="Enable the Snapping Grid"),this.innerControlElements.activateButton.disabled=t&&!n,this.grid.setActive(n),this.updateGridSnapInteraction()};this.onMapAddInteraction=t.getInteractions().on("add",e),this.onMapRemoveInteraction=t.getInteractions().on("remove",e),i&&(t.addInteraction(this.grid),this.updateGridSnapInteraction())}}updateGridSnapInteraction(){if(!this.grid.getActive())return void this.getMap().removeInteraction(this.gridSnapInteraction);const t=this.getMap().getInteractions(),e=t.getArray();function i(t,e){for(let i=t.length-1;i>=0;i+=-1)if(e(t[i]))return i;return-1}const n=i(e,(t=>"function"==typeof t.finishDrawing&&t!==this.drawSnappingOriginsInteraction)),r=i(e,(t=>"function"==typeof t.snapTo&&t!==this.gridSnapInteraction)),s=i(e,(t=>t===this.gridSnapInteraction));Math.max(n,r)>s?(-1!==s&&t.removeAt(s),this.getMap().addInteraction(this.gridSnapInteraction)):-1===n&&-1===r&&this.getMap().removeInteraction(this.gridSnapInteraction)}handleActivateButtonClick(t){t.preventDefault(),this.grid.getActive()?this.getMap().removeInteraction(this.grid):this.drawSnappingOriginsInteraction?this.resetDrawInteraction():this.mapHasOtherDrawInteractions()||(this.drawSnappingOriginsInteraction=new s.ZP({source:this.gridControlPointsVectorLayer.getSource(),type:"Point"}),this.getMap().addInteraction(this.drawSnappingOriginsInteraction),this.enableSnap())}enableSnap(){this.clearSnap(),this.snapInteraction=new a.Z({features:new n.Z}),(0,S.Z)(this.getMap().getLayerGroup(),(t=>{if("function"==typeof t.getSource){const e=t.getSource();if(e&&"function"==typeof e.getFeatures){const t=e.getFeatures();"ready"===e.getState()&&t.length>0&&t.forEach((t=>{this.snapInteraction.addFeature(t)}))}}})),this.getMap().addInteraction(this.snapInteraction)}clearSnap(){this.snapInteraction&&(this.getMap().removeInteraction(this.snapInteraction),this.snapInteraction=null)}mapHasOtherDrawInteractions(){return!!this.getMap().getInteractions().getArray().filter((t=>"function"==typeof t.finishDrawing)).filter((t=>t!==this.drawSnappingOriginsInteraction)).length}handleXInputChanged(){this.grid.setXGridSize(this.getXDim())}handleYInputChanged(){this.grid.setYGridSize(this.getYDim())}handleEscape(t){"Escape"===t.key&&this.drawSnappingOriginsInteraction&&this.resetDrawInteraction()}handleUnitsChanged(){this.grid.setXGridSize(this.getXDim()),this.grid.setYGridSize(this.getYDim())}resetDrawInteraction(){this.drawSnappingOriginsInteraction&&(this.getMap().removeInteraction(this.drawSnappingOriginsInteraction),this.drawSnappingOriginsInteraction=null),this.clearSnap(),this.gridControlPointsVectorLayer.getSource().clear()}getXDim(){return parseFloat(this.innerControlElements.xInput.value)*this.getSelectedUnitConversionFactor()}getYDim(){return parseFloat(this.innerControlElements.yInput.value)*this.getSelectedUnitConversionFactor()}getSelectedUnitConversionFactor(){const t=this.innerControlElements.unitSelector.value;if("m"===t)return 1;if("ft"===t)return 1/3.28084;if("in"===t)return.0254;throw new Error(`Unsupported unit selected: ${t}`)}handleAddGridControlFeature(){const t=this.getMap(),e=this.gridControlPointsVectorLayer.getSource().getFeatures();2===e.length&&(this.resetDrawInteraction(),this.grid.setOriginPoint(e[0].getGeometry().getCoordinates()),this.grid.setRotationControlPoint(e[1].getGeometry().getCoordinates()),t.addInteraction(this.grid),this.grid.setActive(!0))}}const v=I,C={attach(t){const e="us"===t.options.units?"us":"metric",i=new v({units:e});t.map.addControl(i)}}},6528:(t,e,i)=>{i.r(e),i.d(e,{Circle:()=>n.Z,Geometry:()=>r.Z,GeometryCollection:()=>s.Z,LineString:()=>o.Z,LinearRing:()=>a.Z,MultiLineString:()=>d.Z,MultiPoint:()=>c.Z,MultiPolygon:()=>h.Z,Point:()=>l.default,Polygon:()=>u.ZP,SimpleGeometry:()=>g.ZP});var n=i(7276),r=i(1694),s=i(3958),a=i(7538),o=i(2083),d=i(7403),c=i(6259),h=i(3643),l=i(188),u=i(2033),g=i(2967)}}]);