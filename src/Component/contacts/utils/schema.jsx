/**
 * Central shapes & field meta used across the UI.
 * Keep this flexible — DB contacts can be richer than Upload contacts.
 */

/** @typedef {{ key: string, value: string }} ContactAttribute */

/**
 * @typedef {Object} ContactCore
 * @property {string=} id
 * @property {string}  name
 * @property {string=} email
 * @property {string=} phone      // E.164 when possible
 * @property {string=} company
 * @property {string=} title
 * @property {string=} source
 * @property {string=} preferredChannel
 * @property {{email?:boolean,sms?:boolean,whatsapp?:boolean,calls?:boolean}=} optIn
 * @property {Array<ContactAttribute>=} attributes
 * @property {any=}   location
 * @property {string|number|Date=} createdAt
 * @property {string|number|Date=} updatedAt
 */

/** @typedef {ContactCore & { _origin:'db' }} DbContact */
/** @typedef {ContactCore & { _origin:'upload', _sheet?:string }} UploadContact */

/**
 * Field meta for edit controls & rendering.
 * Extend as we add fields; this powers editability rules & column configs.
 */
export const FIELD_META = /** @type {const} */ ({
    id: { label: "ID", type: "id", editable: false },
    name: { label: "Full name", type: "text", editable: true, required: true },
    email: { label: "Email", type: "email", editable: true },
    phone: { label: "Phone", type: "phone", editable: true, required: true },
    title: { label: "Title/Role", type: "text", editable: true },
    source: { label: "Source", type: "text", editable: true },
    preferredChannel: { label: "Preferred", type: "select", editable: true, options: ["WhatsApp", "SMS", "Call", "Email"] },
    optIn: { label: "Permissions", type: "optin", editable: true },
    attributes: { label: "Attributes", type: "kvpairs", editable: true },
    createdAt: { label: "Created", type: "datetime", editable: false },
    updatedAt: { label: "Updated", type: "datetime", editable: false },
});
