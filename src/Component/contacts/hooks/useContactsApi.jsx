import { useMemo } from "react";
import axios from 'axios';
import { useContactsStore } from "../store/useContactsStore";
import { CONTACTS_API_BASE_URL } from "../../../Url";

export default function useContactsApi(partyId) { // Changed: accept partyId
  const hydrate        = useContactsStore((s) => s.hydrate);
  const addContact     = useContactsStore((s) => s.addContact);
  const updateContact  = useContactsStore((s) => s.updateContact);
  const removeContact  = useContactsStore((s) => s.removeContact);
  const bulkRemove     = useContactsStore((s) => s.bulkRemove);
  const setLoading     = useContactsStore((s) => s.setLoading);
  const setError       = useContactsStore((s) => s.setError);

  const api = useMemo(() => {
    if (!partyId) { // Add a guard to prevent API calls without a partyId
        return {
            // Return dummy functions if partyId is not available
            fetchContacts: async () => {},
            createContact: async () => {},
            updateContact: async () => {},
            deleteContact: async () => {},
            bulkDeleteContacts: async () => {},
            importContacts: async () => {},
            exportContacts: async () => {},
            fetchGroups: async () => [],
            deleteGroup: async () => {},
            createGroup: async () => {},
            renameGroup: async () => {},
        };
    }

    const axiosInstance = axios.create({
        baseURL: CONTACTS_API_BASE_URL,
        headers: {
            'x-party-id': partyId, // Changed: use dynamic partyId
        },
    });

    const fetchContacts = async (queryParams) => {
      setLoading(true);
      try {
        // DUMMY DATA
        const dummyContacts = [
          { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', tags: ['lead', 'vip'], list: "Contact" },
          { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', tags: ['customer'], list: "Contact" },
          { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555', tags: [], list: "Contact" },
        ];
        const totalCount = dummyContacts.length;

        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        hydrate(dummyContacts, totalCount);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const createContact = async (contactData, groupId) => {
      setLoading(true);
      try {
        const payload = { ...contactData, partyId: partyId }; // Changed: use dynamic partyId
        if (groupId) {
          payload.groupId = groupId;
        }
        const response = await axiosInstance.post('', payload);
        console.log("useContactsApi - createContact response.data:", response.data); // DEBUG LOG
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const updateContactApi = async (id, contactData) => {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/${id}`, contactData);
        console.log("useContactsApi - updateContactApi response.data:", response.data); // DEBUG LOG
        updateContact(id, response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteContactApi = async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/${id}`);
        removeContact(id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const bulkDeleteContacts = async (ids) => {
      setLoading(true);
      try {
        await axiosInstance.delete('', { data: { ids } });
        bulkRemove(ids);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
      };

    const importContacts = async (file, groupId) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('partyId', partyId); // Changed: use dynamic partyId
        if (groupId) {
          formData.append('groupId', groupId);
        }
        const response = await axiosInstance.post('/import', formData);
        console.log('Import results:', response.data);
        return response.data; // <--- Return the response data
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const exportContacts = async (format, filters) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/export', {
          params: { format, ...filters },
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contacts.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get('/groups', {
          params: { partyId: partyId } // Changed: use dynamic partyId
        });
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      }
    };

    const deleteGroup = async (groupId) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/groups/${groupId}`, {
          params: { partyId: partyId } // Changed: use dynamic partyId
        });
        // We don't need to modify local store here, the calling component will handle removing the tab
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const createGroup = async (groupData) => {
      setLoading(true);
      try {
        const payload = { ...groupData, partyId: partyId }; // Changed: use dynamic partyId
        const response = await axiosInstance.post('/groups', payload);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const renameGroup = async (groupId, newName) => {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/groups/${groupId}`, { name: newName, partyId: partyId }); // Changed: use dynamic partyId
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };


    return {
      fetchContacts,
      createContact,
      updateContact: updateContactApi,
      deleteContact: deleteContactApi,
      bulkDeleteContacts,
      importContacts,
      exportContacts,
      fetchGroups,
      deleteGroup,
      createGroup,
      renameGroup,
    };
  }, [partyId, hydrate, addContact, updateContact, removeContact, bulkRemove, setLoading, setError]); // Changed: add partyId to dependency array

  return api;
}