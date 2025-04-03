

const style = {
  newticketsAutocomplete: {
    height: '32px',
    border: '1px solid #c9c9cd',
    width: '100%',
    marginBottom: '15px',
    '&:hover': {
      border: '1px solid blue !important',
    },
    '&.Mui-focused': {
      border: '1px solid blue !important',
      outline: 'none',
    },


  },
  ticketsStatusAutocomplete: {
    minWidth: '100px',
    height: '32px',
  },

  chipStyles: {
    background: '#ffe9bc',
    color: '#755b00',
    borderRadius: '3px',
    padding: '0px 6px',
    fontSize: '14px',
    ml: '9px',
  },
  accordionSummary: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'black',
  },
  accordionDetails: {
    fontSize: '14px'
  },
  meetingEventLinkBtn: {
    color: 'blue',
    marginTop: '10px'

  },
  analyticPeriodDropdown:{
    height: '32px',
    border: 'none !important',
    width: '100%',
    marginBottom: '15px',
     marginTop:'20px',
    '&:hover': {
      border: 'none !important',
    },
    '&.Mui-focused': {
      border: 'none !important',
      outline: 'none',
    },
 },
 operatorPerformaceUser:{
  border: '1px solid rgb(232, 234, 242)',
  borderRadius: '4px',
  width: '200px',
  minHeight: '40px',
  paddingLeft: '10px',
 paddingBottom: '25px',
  backgroundColor: 'rgb(245, 246, 250)',
  '&:hover': {
    border: '1px solid green',
  },
  '&.Mui-focused': {
    border: '1px solid green',
    backgroundColor: 'white',
    outline: 'none',
  },
 },
 workflowVariableBtn:{
  padding: '4px 6px 2px',
  borderRadius: '6px',
  backgroundColor: 'rgb(77 80 85 / 10%)',
 }
 
}
export default style;