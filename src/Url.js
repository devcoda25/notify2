// const baseURL = process.env.REACT_APP_API_URL + "/api/v1.0/web/notify/template";
// const setDefaultLanguage = baseURL + "/language/set-default"
// export default {baseURL, setDefaultLanguage};

  const getAuthIdFromUrl = () => {
    const parts = window.location.pathname.split('/');
    return parts[2] || 0;
  };

//   const headers = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'X-Authuser': getAuthIdFromUrl(),
//     'X-Request-Agent': 'APP',
//     'X-SID': 'sid_r3fCxGnrMOp07mKQaCiS',
//     'X-MUID': 'mut_XHujrA2WUG51hx3uOLL8'
//   };

   const headers = { 'Accept': 'application/json', "X-Authuser": getAuthIdFromUrl() };


export const config = { headers, withCredentials: true } 
export function base(){
    return process.env.REACT_APP_API_URL + "http://localhost:7440";
}

export const CONTACTS_API_BASE_URL = 'http://localhost:7440/api/v1.0/web/notify/contacts'; // Updated API base URL for contacts
export const TEMPLATES_API_BASE_URL = 'http://localhost:7440/api/v1.0/web/notify/templates'; // API base URL for templates

export function coreBase(){
    return process.env.REACT_APP_API_URL + "/api/v1.0/app/core/user/modules/user";
}

// Categories
export function fetchCategories(){
    return base() + "/categories";
}
export function addCategory(){
    return base() + "/category/store";
}
export function updateCategory(){
    return base() + "/category/update";
}
export function deleteCategory(){
    return base() + "/category/delete";
}
export function showCategory(){
    return base() + "/category/show";
}

// Content-Types
export function fetchContentTypes(){
    return base() + "/content-types";
}
export function addContentType(){
    return base() + "/content-type/store";
}
export function updateContentType(){
    return base() + "/content-type/update";
}
export function deleteContentType(){
    return base() + "/content-type/delete";
}
export function showContentType(){
    return base() + "/content-type/show";
}

// Variables
export function fetchvarVariables(){
    return base() + "/variables";
}
export function addVariable(){
    return base() + "/variable/store";
}
export function editVariable(){
    return base() + "/variable/update";
}
export function deleteVariable(){
    return base() + "/variable/delete";
}
export function showVariable(id) {
    return base() + `/variable/show?id=${id}`;
}


export function fetchChannels(){
    return base() + "/channels";
}
export function addChannel(){
    return base() + "/channel/store";
}
export function updateChannel(){
    return base() + "/channel/update";
}
export function deleteChannel(){
    return base() + "/channel/delete";
}
export function showChannel(){
    return base() + "/channel/show";
}

// Templates and Languages
export function fetchTemplates(){
    return base() + "/templates";
}
export function addTemplate(){
    return base() + "/template/store";
}
export function updateTemplate(){
    return base() + "/template/update";
}
export function showTemplates(){
    return base() + "/template/show";
}
export function deleteTemplate(){
    return base() + "/template/delete";
}
export function fetchLanguages(){
    return base() + "/languages";
}
export function addLanguage(){
    return base() + "/language/store";
}
export function deleteLanguage(){
    return base() + "/language/delete";
}
export function setDefaultLanguage(){
    return base() + "/language/set-default";
}

// contents
export function fetchContents(){
    return base() + "/contents";
}
export function addContent(){
    return base() + "/content/store";
}
export function updateContent(){
    return base() + "/content/update";
}
export function deleteContent(){
    return base() + "/content/delete";
}
export function showContent(){
    return base() + "/content/show";
}

// New Template Page ( Your template )

export function AddYourTemplate(){
    return base() + "/client/template/store"
}

export function getAllTemplates(){
    return base() + "/client/templates"
}

export function UpdateTemplatemodule(){
    return base() + "/client/template/update"
}

export function deleteTemplatemodule(){
    return base() + "/client/template/delete"
}



// API for get ev core Modules
export function getModules(){
    return coreBase()
}




const Url = () => {
  return (
    <div>

    </div>
  )
}

export default Url