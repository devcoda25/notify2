import { useMemo } from "react";
import axios from 'axios';
import useTemplatesStore from "../store/useTemplatesStore";
import { useUserStore } from "../../../auth/user.store";
import { TEMPLATES_API_BASE_URL } from "../../../Url";

export default function useTemplatesApi() {
  const {
    setTemplates,
    addTemplate,
    updateTemplateState,
    removeTemplate,
    upsertTemplate,
    setLoading,
    setError,
  } = useTemplatesStore((s) => ({
    setTemplates: s.setTemplates,
    addTemplate: s.addTemplate,
    updateTemplateState: s.updateTemplateState,
    removeTemplate: s.removeTemplate,
    upsertTemplate: s.upsertTemplate,
    setLoading: s.setLoading,
    setError: s.setError,
  }));

  const partyId = useUserStore((s) => s.currentUser.id);

  const api = useMemo(() => {
    if (!partyId) {
      console.warn("useTemplatesApi: partyId is missing from user store. API calls will be disabled.");
      return {};
    }

    const axiosInstance = axios.create({
      baseURL: TEMPLATES_API_BASE_URL,
      headers: {
        'x-party-id': partyId,
      },
      withCredentials: true,
    });

    // --- Templates ---

    const fetchTemplates = async (queryParams) => {
      setLoading(true);
      try {
        // DUMMY DATA
        const dummyTemplates = [
          { id: '1', name: 'Welcome Email', description: 'The first email a user gets.', tags: ['onboarding'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), category: "API" },
          { id: '2', name: 'Password Reset', description: 'Email for resetting password.', tags: ['account'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), category: "API" },
          { id: '3', name: 'Monthly Newsletter', description: 'The monthly company newsletter.', tags: ['marketing'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), category: "API" },
        ];
        const total = dummyTemplates.length;

        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setTemplates(dummyTemplates, total);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const createTemplate = async (templateData) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('', templateData);
        addTemplate(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const getTemplate = async (id) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/${id}`);
        upsertTemplate(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const updateTemplate = async (id, templateData) => {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/${id}`, templateData);
        updateTemplateState(id, response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const archiveTemplate = async (id) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/${id}/archive`);
        updateTemplateState(id, response.data);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteTemplate = async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/${id}`);
        removeTemplate(id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const duplicateTemplate = async (id, payload) => {
      setLoading(true);
      try {
        const response = await axiosInstance.post(`/${id}/duplicate`, payload);
        addTemplate(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    // --- Template Versions ---

    const createTemplateVersion = async (templateId, payload) => {
      return axiosInstance.post(`/${templateId}/versions`, payload);
    };

    const getVersionById = async (versionId) => {
      return axiosInstance.get(`/versions/${versionId}`);
    };

    const updateVersion = async (versionId, payload) => {
      return axiosInstance.put(`/versions/${versionId}`, payload);
    };

    const updateVariableSchema = async (versionId, payload) => {
      return axiosInstance.put(`/versions/${versionId}/schema`, payload);
    };

    // --- Template Variants & Content ---

    const getVariant = async (variantId) => {
      return axiosInstance.get(`/variants/${variantId}`);
    };

    const updateVariant = async (variantId, payload) => {
      return axiosInstance.put(`/variants/${variantId}`, payload);
    };

    const deleteVariant = async (variantId) => {
      return axiosInstance.delete(`/variants/${variantId}`);
    };

    const updateVariantContent = async (variantId, payload) => {
      return axiosInstance.put(`/variants/${variantId}/content`, payload);
    };

    // --- Approval Workflow ---

    const submitForApproval = async (versionId, payload) => {
      return axiosInstance.post(`/versions/${versionId}/approval-requests`, payload);
    };

    const listApprovalRequests = async (queryParams) => {
      return axiosInstance.get('/approval-requests', { params: queryParams });
    };

    const getApprovalRequestById = async (requestId) => {
      return axiosInstance.get(`/approval-requests/${requestId}`);
    };

    const castVote = async (requestId, payload) => {
      return axiosInstance.post(`/approval-requests/${requestId}/vote`, payload);
    };
    
    const getProviderStatuses = async (variantId) => {
      return axiosInstance.get(`/variants/${variantId}/provider-statuses`);
    };

    const syncProviderStatuses = async (variantId) => {
      return axiosInstance.post(`/variants/${variantId}/provider-statuses/sync`);
    };

    // --- Utility Endpoints ---

    const renderPreview = async (payload) => {
      return axiosInstance.post('/utils/preview', payload);
    };

    const validateVariant = async (payload) => {
      return axiosInstance.post('/utils/validate', payload);
    };

    const sendTest = async (templateId, payload) => {
      return axiosInstance.post(`/${templateId}/test-send`, payload);
    };

    return {
      fetchTemplates,
      createTemplate,
      getTemplate,
      updateTemplate,
      archiveTemplate,
      deleteTemplate,
      duplicateTemplate,
      createTemplateVersion,
      getVersionById,
      updateVersion,
      updateVariableSchema,
      getVariant,
      updateVariant,
      deleteVariant,
      updateVariantContent,
      submitForApproval,
      listApprovalRequests,
      getApprovalRequestById,
      castVote,
      getProviderStatuses,
      syncProviderStatuses,
      renderPreview,
      validateVariant,
      sendTest,
    };
  }, [partyId, setTemplates, addTemplate, updateTemplateState, removeTemplate, setLoading, setError, upsertTemplate]);

  return api;
}
