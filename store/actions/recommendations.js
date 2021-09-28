export const SET_FACEBOOK_RECOMMENDATIONS = 'SET_FACEBOOK_RECOMMENDATIONS';
export const SET_RECOMMENDATION_STATUS = 'SET_RECOMMENDATION_STATUS';

export const setFacebookRecommendations = recommendations => {
  //recommendations data structure : [{name: String, username:String, status:String(relations), dp:String, uid:String}]
  recommendations = recommendations || [];

  //byIds
  let recommendationsByIds = {};
  for (let i = 0; i < recommendations.length; i++) {
    recommendationsByIds[recommendations[i].uid] = recommendations[i];
  }

  //allIds
  let recommendationsAllIds = recommendations.map(obj => obj.uid);

  return {
    type: SET_FACEBOOK_RECOMMENDATIONS,
    payload: {byIds: recommendationsByIds, allIds: recommendationsAllIds},
  };
};

export const setRecommendationStatus = (uid, status) => {
  return {
    type: SET_RECOMMENDATION_STATUS,
    payload: {uid, status},
  };
};
