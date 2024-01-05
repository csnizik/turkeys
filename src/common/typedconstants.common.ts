export interface ISearchOptionMap {
  [key: string]: any;
}
export const searchOptionMap: ISearchOptionMap = {
  //Overview: { id: 0, displayName: 'Overview' }, Don't need overview for now story-1566
  ConservationPractices: { id: 0, displayName:  'Conservation Practices' },
  ResourceConcerns: { id: 1, displayName: 'Resource Concerns'},
  ProjectsAndInitiatives: { id: 2,displayName: 'Projects And Initiatives',},
};

export const ConservationPracticeSections: any = [
  {
    sectionId: 0,
    sectionName: 'Resource Concerns Treated',
    anchorLink: '#ResourceConcernsTreated',
  },
  {
    sectionId: 1,
    sectionName: 'Support for this Practice',
    anchorLink: '#SupportPractice',
  },
  {
    sectionId: 2,
    sectionName: 'Practice Specifications and Tools',
    anchorLink: '#PracticeSpecifications',
  },
  // TO DO Impacts: Put back in the next PI
  // {
  //   sectionId: 3,
  //   sectionName: 'Impacts of Applying this Practice',
  //   anchorLink: '#ImpactsPractice',
  // },
  {
    sectionId: 3,
    sectionName: 'Practice Projects & Initiatives',
    anchorLink: '#ProjectsInitiatives',
  },
];

export const intialPracticeState: any = {
  practice: [],
};

export const initialResourceState: any = {
  resources: [],
};

export const initialLandUse = {
  'Other Farm and Rural Land': false,
  Cropland: false,
  'Developed land/Urban Ag': false,
  Forestland: false,
  Pasture: false,
  Rangeland: false,
  Protected: false,
};

export const practiceStandardGuideText = {
  title: "Accessing this state's Practice Standards on the NRCS Website",
  firstStep: '1. Go to the',
  secondStep:
    '2. On the toolbar below the state selector ensure that “Document Tree” is selected',
  thirdStep:
    '3. Click “Section 4 - Practice Standards and Supporting Documents”',
  fourthStep: '4. Select Conservation Practice Standards & Support Documents',
  fifthStep:
    '5. Select your desired practice standard from the list, this will load the documents related to your practice standard',
};

export const practiceStandardGuideLink = {
  stateConservationPracticeText: `${' '}NRCS Conservation Practices Website${' '}`,
  viewStateConservationPracticeText: `${' '}View this State's Conservation Practices${' '}`,
  viewStateConservationPracticeLink: `https://efotg.sc.egov.usda.gov/#/state/`,
  webpagePromptText: `Go Straight to this State’s Field Office Technical Guide`,
  pdfReportPromptText: `State Specific National Conservation Practices`,
};

export const tableauGraph = {
  RegionalConservationPractice: {
    id: 0,
    displayName: 'Regional Conservation Practice',
  },
  ConservationPracticeCategory: {
    id: 1,
    displayName: 'Conservation Practice Category',
  },
  PracticeDetail: {
    id: 2,
    displayName: 'Practice Detail',
  },
  EquipPracticeCertificationTrend: {
    id: 3,
    displayName: 'Equip Practice Certification Trend',
  },
  TopPracticesEQUIPOpenData: {
    id: 4,
    displayName: 'Top Practices Equip Open Data',
  },
};

export const CPPEScoreLegendData = {
  title: "Conservation Practices Ranked by Physical Effects (CPPE) | NRCS",
  disclaimer: "This page provides a screening tool to view the effectiveness of conservation practices in treating the specific resource concern at a national level. The positive CPPE score does not ensure treatment of resource concernsand may conflict with other resource concerns. Please contact your local NRCS conservation planners for professional assistance.",
  linklabel:"Conservation Practice Physical Effects (CPPE) | NRCS",
}

export const NextStepsData = {
  title:"Next Steps",
  subtitle:"Find Your Local Service Center",
  nextStepsParghraph:"Interested in getting started? USDA Service Centers are offices where you can typically meet face-to-face with USDA, Farm Service Agency (FSA) and Natural Resources Conversation Service (NRCS) staff to discuss your vision, goals and ways USDA can help.",
  linklable:"Find your local Service Center",
}