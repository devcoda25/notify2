// src/Pages/Contacts.jsx
import { ThemeProvider } from '@mui/material';
import { ContactsPage } from "../Component/contacts";
import { notifyTheme } from '../theme/notifyTheme';
export default function Contacts() { return <ThemeProvider theme={notifyTheme}><ContactsPage /></ThemeProvider>; }
