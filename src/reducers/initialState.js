export default {
  fuelSavings: {
    newMpg: '',
    tradeMpg: '',
    newPpg: '',
    tradePpg: '',
    milesDriven: '',
    milesDrivenTimeframe: 'week',
    displayResults: false,
    dateModified: null,
    necessaryDataIsProvidedToCalculateSavings: false,
    savings: {
      monthly: 0,
      annual: 0,
      threeYear: 0
    }
  },
  roomsStates: {
    rooms: [],
    room: {
      id: undefined,
      name: '',
      logo: '',
      interviewer: '',
      candidates: [],
      problems: []
    },
    isWaiting: false
  },
  problemStates: {
    problems: [],
    isWaiting: false
  },
  user: {
    isLogin: false,
    wrongPassword: false,
    token: null,
    type: null,
    info: {}
  },
  candidatesStates:{
    candidates:[],
    isWaiting: false
  }
};
