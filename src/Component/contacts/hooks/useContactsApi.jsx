import { useMemo } from "react";
import axios from 'axios';
import { useContactsStore } from "../store/useContactsStore";
import { CONTACTS_API_BASE_URL } from "../../../Url";

const TEMP_PARTY_ID = 'p_26AR7VU6EVA575RQ6RK3XJ';

export default function useContactsApi() {
  const hydrate        = useContactsStore((s) => s.hydrate);
  const addContact     = useContactsStore((s) => s.addContact);
  const updateContact  = useContactsStore((s) => s.updateContact);
  const removeContact  = useContactsStore((s) => s.removeContact);
  const bulkRemove     = useContactsStore((s) => s.bulkRemove);
  const setLoading     = useContactsStore((s) => s.setLoading);
  const setError       = useContactsStore((s) => s.setError);

  const api = useMemo(() => {
    const axiosInstance = axios.create({
        baseURL: CONTACTS_API_BASE_URL,
        headers: {
            'x-party-id': TEMP_PARTY_ID,
        },
    });

    const fetchContacts = async (queryParams) => {
      setLoading(true);
      try {
        // Prepare params for API: stringify filters and use debounced search
        const { pageSize, page, groupId, ...rest } = queryParams;
        const apiParams = { 
          ...rest,
          limit: pageSize,
          page: page,
          partyId: TEMP_PARTY_ID,
        };
        if (groupId) {
          apiParams.groupId = groupId;
        }
        if (apiParams.filters && Object.keys(apiParams.filters).length > 0) {
          apiParams.filters = JSON.stringify(apiParams.filters);
        } else {
          delete apiParams.filters;
        }

        const response = await axiosInstance.get('', { params: apiParams });
        console.log("API Response:", response.data);
        console.log("API Response totalCount:", response.data.totalCount);
        console.log("API Response pageInfo.totalCount:", response.data.pageInfo?.totalCount);
        // Pass the correct data to the new hydrate function
        hydrate(response.data.items, response.data.pageInfo?.totalCount);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const createContact = async (contactData, groupId) => {
      setLoading(true);
      try {
        const payload = { ...contactData, partyId: TEMP_PARTY_ID };
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
        formData.append('partyId', TEMP_PARTY_ID);
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
          params: { partyId: TEMP_PARTY_ID }
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
          params: { partyId: TEMP_PARTY_ID }
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
        const payload = { ...groupData, partyId: TEMP_PARTY_ID };
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
        const response = await axiosInstance.put(`/groups/${groupId}`, { name: newName, partyId: TEMP_PARTY_ID });
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
  }, [hydrate, addContact, updateContact, removeContact, bulkRemove, setLoading, setError]);

  return api;
}
