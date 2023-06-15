export const environment = {
  production: false,
  baseUrl: "https://sit.almubasher.com.sa/",
  serviceContext: "business-resource/",
  documentContext: "business-documents/",
  businessHubContext: "hub/",
  //bfmUrl: 'https://www.almubasher.com.sa/business-bfmapi/', /// Prod
  bfmUrl: 'https://smeaowapiuat.alrajhibank.com.sa/BFM/',
  environments:
    [
      {text: "SIT-1", value: {baseUrl: "https://sit.almubasher.com.sa/", serviceContext: "business-resource/"}},
      {text: "SIT-2", value: {baseUrl: "https://sit.almubasher.com.sa/", serviceContext: "business2-resource/"}},
      {text: "SIT-3", value: {baseUrl: "https://sit.almubasher.com.sa/", serviceContext: "business3-resource/"}},
      {text: "UAT", value: {baseUrl: "https://uat.almubasher.com.sa/", serviceContext: "business-resource/"}},
      {text: "PILOT", value: {baseUrl: "https://www.almubasher.com.sa/", serviceContext: "business-pilot-resource/"}},
      {text: "PROD", value: {baseUrl: "https://www.almubasher.com.sa/", serviceContext: "business-resource/"}},
    ]
};
