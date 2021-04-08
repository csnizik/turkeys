// Query Help: https://developers.arcgis.com/javascript/latest/sample-code/featurelayer-query-basic/
export const queryLayer = (layer: any, whereClause: string, outputFields: string[]) => {
  var query = layer.createQuery();
  query.where = whereClause;
  query.outFields = outputFields;

  return layer.queryFeatures(query)
  .then(function(queryResults: any) {
     return queryResults;
   });
}