import { FaWeight } from "react-icons/fa";


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
  analyticPeriodDropdown: {
    height: '32px',
    border: 'none !important',
    width: '100%',
    marginBottom: '15px',
    marginTop: '20px',
    '&:hover': {
      border: 'none !important',
    },
    '&.Mui-focused': {
      border: 'none !important',
      outline: 'none',
    },
  },
  operatorPerformaceUser: {
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
  workflowVariableBtn: {
    padding: '4px 6px 2px',
    borderRadius: '6px',
    backgroundColor: 'rgb(77 80 85 / 10%)',
  },
  eventTimingDropdown: {
    background: '#e7edf6',
    color: '#a6bbd1',
    border: 'none !important',
    outline: 'none !important'
  },
  defaultActionGrid: {
    marginLeft: '3.5rem',
    width: '240px',
    marginTop: '25px',
  },
  automationAutoComplete: {

    border: '1px solid rgb(232, 234, 242)',
    borderRadius: '4px',
    height: '36px',
    paddingLeft: '10px',
    width: '100%',
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
  tablecontainer: {
    boxShadow: "none",
    borderRadius: 0,
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  tableheaderCell: {
    borderBottom: "1px solid #e0e0e0",
    fontWeight: 600,
    padding: "20px 25px",
    fontSize: "1.2rem",
  },
  tableiconBodyStyle: {
    display: "flex",

  },
  tablebodyCell: {
    borderBottom: "none",
    padding: "20px 25px",
    fontSize: "1.2rem",
  },
  tableIconBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid rgb(206, 208, 206)',
    borderRadius: '5px',
    background: 'rgb(245, 246, 250)',
    marginRight: '10px',
    cursor: 'pointer'
  },
  tableeditHover: {
    "&:hover": {
      border: "1px solid rgb(35 164 85 / 85%)",
      color: "rgb(35 164 85 / 85%)",

    },
  },
  tabledeleteHover: {
    "&:hover": {
      border: "1px solid red",
      color: "red",

    },
  },
 
  deleteIconHover: {
    
    "&:hover": {
     color: "red",

    },
  },
  customTablePagination: {
    '.MuiTablePagination-displayedRows': {
      fontSize: '1.2rem',
      margin: '0px',
      color: 'rgb(51, 51, 51)',
    },
    '.MuiSelect-nativeInput': {
      padding: '0px 1rem',
      height: '3rem',
      margin: '0 0 8px 0px',
    },
    '.MuiInputBase-root': {
      fontSize: '1.2rem',
      paddingRight: '0',
    },
    '.MuiTablePagination-selectLabel': {
      fontSize: '1.2rem',
      margin: '0px',
      color: 'rgb(51, 51, 51)',
    },
  },
  keywordSlider: {

    height: 8,
    maxWidth: '540px',
    margin: '0px 10px',
    color: 'rgb(35, 164, 85)',
    '& .MuiSlider-rail': {
      opacity: 0.38,
      height: 'inherit',
      backgroundColor: 'currentColor',
      borderRadius: 'inherit',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '& .MuiSlider-track': {
      borderRadius: '4px',
      height: 8,
    },
    '& .MuiSlider-thumb': {
      height: 25,
      width: 25,
      backgroundColor: '#fff',
      border: '7px solid rgb(35, 164, 85)',
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: '0px 0px 0px 8px rgba(35, 164, 85, 0.16)',
      },
      '&::after': {
        position: 'absolute',
        content: '""',
        width: 42,
        height: 42,
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
    '& .MuiSlider-valueLabel': {
      left: 'calc(-50% + 6px)',
      marginTop: '-8px',
      background: 'rgb(233, 246, 238)',
      border: '1px solid rgb(35, 164, 85)',
      color: 'rgb(35, 164, 85)',
      boxSizing: 'border-box',
      borderRadius: '5px',
      position: 'relative',
      fontWeight: 500,
      fontSize: 12,
      lineHeight: '18px',
      padding: '6px 12px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 'calc(100% - 1px)',
        left: '50%',
        transform: 'translateX(-50%)',
        borderTop: '10px solid rgb(35, 164, 85)',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        width: 0,
        height: 0,
        borderRadius: '5px',
      },
      '&::after': {
        content: '""',
        top: 'calc(100% - 3px)',
        left: '50%',
        transform: 'translateX(-50%)',
        position: 'absolute',
        borderTop: '10px solid rgb(233, 246, 238)',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        width: 0,
        height: 0,
        borderRadius: '5px',
      },
    },
    '& .MuiSlider-valueLabel span': {
      width: 'auto',
      height: 'auto',
      translate: 'none',
      background: 'none',
      color: 'rgb(35, 164, 85)',
    },

  },
  timeslots_list_nextbtn: {
    marginLeft: '10px',
    fontSize: '12px',
    width: '48.5%',
    fontWeight: 'bold',
    borderRadius: '2px',
    padding: '0px',
    boxShadow: 'none !important',
    height: '52px',
    background: '#006bff !important'
  },
  troubleshoot_btn: {
    textTransform: "capitalize",
    border: "1px solid #476788",
    color: "black",
    borderRadius: "40px",
    padding: "6px 20px",
  },
  cookie_btn: {
    color: '#004eba',
    fontSize: '16px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'white',
      '& span': {
        textDecoration: 'underline',
      },
    },
  },
  report_btn: {
    color: '#0a2540 !important',
    fontSize: '13px !important',
    '&:hover': {
      backgroundColor: 'white',
      '& span': {
        textDecoration: 'underline',
      },
    },
  },
  checkcircle: {
    color: "#00796b",
    fontSize: 20
  },
  oneonone_select_container: {
    borderRadius: 1,
    width: '100%',
    '& .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #c9c9cd',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #c9c9cd',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
    },
  },
  oneone_select_menu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  //edit location modal -->oneonone
  editlocation_modal: {
    width: '400px',
    borderRadius: 1,
  },
  editlocation_heading: {
    color: '#0a2540',
    fontSize: '23px',
    fontWeight: 700,
  },
  location_option_btn: {
    color: '#004eba !important',
    fontSize: '16px'
  },
  eventAccordion: {
    boxShadow: 'none',
    border: 'none',
    borderBottom: '1px solid #F2F2F2',
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  eventheading: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'black'
  },
  eventAccordionsummary: {
    padding: '16px 24px',
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      margin: 0,
    },
  },
  calendar_invitation_custombtn: {
    fontSize: '16px',
    color: '#004eba',
    padding: '0px 3px 0px 0px'
  },
  calendarlist_timePickerStyles: {
    background: 'white',
    border: '1px solid #a6bbd1',

    "& .MuiOutlinedInput-root": {

      "&:hover fieldset": {
        border: "2px solid #006bff",


      },
      "&.Mui-focused fieldset": {
        border: "2px solid #006bff",


      },
    },
  },
  calendarlist_iconStyle: {
    marginLeft: '10px',
    cursor: "pointer",
    width: "16px",
    height: "16px"
  },
  busyrule_customdropdown: {
    width: '150px',
    color: '#004eba',
    fontWeight: '700',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  userAutocompleteStyle: {
    border: '1px solid rgb(232, 234, 242)',
    borderRadius: '4px',
    height: '3rem',
    paddingLeft: '10px',
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
  templateAccordionStyle: {
    boxShadow: 'none',
    border: '1px solid #e2e2e4',
    borderRadius: '8px',
    marginTop: '25px'
  },
  templateAccordionHeading: {
    fontWeight: 600,
    fontSize: '16px',
  },
  templateAutocompleteStyle: {
    backgroundColor: 'rgb(245, 246, 250) !important',
  },
  newTemplateRadiobtn: {
    color: 'rgb(231 231 232)',
    '&.Mui-checked': {
      borderColor: 'rgb(231 231 232)',
      color: 'green',
    },

  },
  broadcastRadiobtn: {
    color: 'rgb(231 231 232)',
    '&.Mui-checked': {
      borderColor: 'rgb(231 231 232)',
      color: 'green',
    },

  },
  meetinghistory_content: {
    p: 2,
    display: 'flex',
    gap: 2
  },
  meetinghistory_leftcontent: {
    flex: 2
  },
  meetinghistory_header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
  },
  meetinghistory_paper: {
    p: 2,
    mb: 2,
    borderRadius: '0 0 16px 16px', 
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
  },
  archivemeetbtn:{
    mt: 2,
    backgroundColor: '#d32f2f',
    color: '#fff',
    fontWeight: 'bold',
    width:'100%',
    textTransform:'capitalize',
    borderRadius:'21px',
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
  },
  meetinghistoryModalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    p: 2,
    width: '38%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  meetinghistory_headercontent:{
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  alignItems: 'center',
  },
  meetingheader_date:{
   display: 'flex', 
   alignItems: 'center', 
   minWidth: 120 
  },
  meetinghistory_video:{
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 1, 
    px: 1 
  },
  meetinghistory_rightcontent:{
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    gap: 2 
  },
  meetinghistory_comment:{
    maxHeight: 320, 
    overflowY: 'auto',
    pr: 1
  },
  meetingcomment_list:{
   p: 1,
  borderRadius: 1,
  '&:hover .actions': { visibility: 'visible' },
 '&:hover': { backgroundColor: '#f9f9f9' },
  position: 'relative'
  },
  meetinghistory_filesupload:{
    maxHeight: '135px', 
    overflowY: 'auto', 
    pr: 1 
  },
  meetinghistory_options:{
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center' 
  },
  meetinghistory_editheader:{
   display: 'flex', 
    justifyContent: 'space-between', 
    mb: 2 
  },
  meetinghistory_editfooter:{
   display: 'flex', 
   justifyContent: 'flex-end', 
   gap: 2,
   marginTop:'15px',
  },
  new_teaminbox_container:{
   display: 'flex', 
   position: 'absolute', 
   top: '57px', 
   width: '100%' 
  },
  teaminbox_search_container:{
  display: 'flex', 
  alignItems: 'center', 
  px: 2, 
  },
  teaminbox_sidebar_header:{
    pl: 2, pt: 1, color: 'gray' 
  },
  new_teaminbox_filter:{
   border:'1px solid #ccc',
    borderRadius:'4px',
    width:'38px',
    height:'43px',
    
  }

}
export default style;