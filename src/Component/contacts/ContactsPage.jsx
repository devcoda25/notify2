// /src/Component/contacts/ContactsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, IconButton, Typography, Grid, Chip,
  FormGroup, FormControlLabel, Checkbox, MenuItem, Divider, InputAdornment,
  Autocomplete, Box, Menu, ListItemIcon, ListItemText, Paper, Tooltip
} from "@mui/material";
import ContactsTabs from "./layouts/ContactsTabs";
import ContactsToolbar from "./Toolbar/ContactsToolbar";
import BulkBar from "./Toolbar/BulkBar";
import ContactsTable from "./Table/ContactsTable";
import ContactDetailsDrawer from "./drawers/ContactDetailsDrawer";
import EditContactDrawer from "./drawers/EditContactDrawer";
import AddContactModal from "./Modals/AddContactModal";
import DeleteConfirmModal from "./Modals/DeleteConfirmModal";
import ExportContactsModal from "./Modals/ExportContactsModal";
import FilterContactsModal from "./Modals/FilterContactsModal";
import ImportContactsModal from "./Modals/ImportContactsModal";

import useSelection from "./hooks/useSelection";
import useUploadWorkspace from "./hooks/useUploadWorkspace";
import { useParams } from "react-router-dom";
import useContactsApi from "./hooks/useContactsApi"; // Added

import { useContactsStore, selectContactsPagedRows, selectContactsFilteredCount } from "./store/useContactsStore"; // Modified
import { DEFAULT_COLUMNS } from "./utils/mappers";

/* ------------------------------ component ------------------------------ */
export default function ContactsPage() {
  const { authUser } = useParams();
  // Query & uploads
  const [queryParams, setQueryParams] = useState({
    search: "",
    sortBy: "updatedAt",
    sortDir: "desc",
    page: 0,
    pageSize: 100,
    filters: {},
    groupId: undefined, // New field for persistent sheets
  });
  const [activeTabId, setActiveTabId] = useState("db");
  const uploads = useUploadWorkspace();
  const api = useContactsApi(authUser); // Added

  // Store (DB)
  const dbRows = useContactsStore(selectContactsPagedRows); // Modified to use selector
  const dbById = useMemo(() => Object.fromEntries(dbRows.map((r) => [r.id, r])), [dbRows]); // Modified
  const callContact = useContactsStore((s) => s.callContact);
  const totalCount = useContactsStore(selectContactsFilteredCount); // Added

  // Initial data fetch
  useEffect(() => {
    console.log("Fetching contacts with queryParams:", queryParams);
    api.fetchContacts(queryParams);
  }, [api, queryParams]); // Fetch contacts on component mount and when queryParams change

  // Fetch groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      // Only fetch groups if the API is ready and there are no persistent tabs yet.
      // This prevents re-fetching when the component re-renders.
      if (api && api.fetchGroups && !uploads.tabs.some(t => t.isPersistent)) {
        try {
          const existingGroups = await api.fetchGroups();
          if (existingGroups && existingGroups.length > 0) {
            uploads.addGroups(existingGroups);
          }
        } catch (error) {
          console.error("Failed to fetch groups:", error);
        }
      }
    };
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, uploads.tabs.length]);

  

  useEffect(() => {
    if (activeTabId !== "db" && !uploads.tabs.some((t) => t.id === activeTabId)) {
      setActiveTabId("db");
    }
    // Update queryParams when activeTabId changes
    const activeTab = uploads.tabs.find(t => t.id === activeTabId);
    setQueryParams(prev => ({
      ...prev,
      page: 0, // Reset page when tab changes
      groupId: activeTab?.isPersistent ? activeTab.groupId : undefined,
    }));
  }, [activeTabId, uploads.tabs, setQueryParams, uploads.tabs]); // Added setQueryParams and uploads.tabs to dependencies

  const isDB = activeTabId === "db";
  const context = isDB ? "db" : "upload";

  // Current tab rows (uploads get stable ids via ensureIds)
  const activeUploadTab = uploads.tabs.find((t) => t.id === activeTabId) || null;
  // If it's a persistent tab, rows will be fetched from backend, not stored locally
  const uploadRowsRaw = activeUploadTab?.isPersistent ? [] : (activeUploadTab?.rows || []);
  const uploadRows = useMemo(
    () => uploadRowsRaw.map((r, i) => ({ ...r, id: r.id || `u_${activeTabId.slice(0, 6)}_${i}`, _origin: "upload" })),
    [uploadRowsRaw, activeTabId]
  );

  const isPersistentSheet = !isDB && activeUploadTab?.isPersistent;
  const allRowsCurrentTab = (isDB || isPersistentSheet) ? dbRows : uploadRows; // dbRows is already paged/filtered/sorted

  /* ------------------ filter/sort/paginate (current tab) ------------------ */
  // These are now handled by the API, so we directly use dbRows for the DB tab
  const pagedCurrent = allRowsCurrentTab; // Data is already paged by API

  const pageIds = useMemo(() => pagedCurrent.map((r) => r.id), [pagedCurrent]);
  const allIdsFiltered = useMemo(() => pagedCurrent.map((r) => r.id), [pagedCurrent]); // For selection, use pagedCurrent

  /* ------------------------------ selection ------------------------------ */
  const selection = useSelection({ pageIds, allIds: allIdsFiltered });

  /* ------------------------------- ui state ------------------------------ */
  const [ui, setUi] = useState({
    addOpen: false,
    importOpen: false,
    exportOpen: false,
    filterOpen: false,
    deleteOpen: false,
    detailsOpen: false,
    editOpen: false,
    newGroupOpen: false, // New state for the dialog
  });
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [mainDbTotal, setMainDbTotal] = useState(0); // Cache for main DB count

  const open = (k) => setUi((s) => ({ ...s, [k]: true }));
  const close = (k) => setUi((s) => ({ ...s, [k]: false }));

  // Effect to cache the main DB total count when its tab is active
  useEffect(() => {
    if (activeTabId === 'db') {
      setMainDbTotal(totalCount);
    }
  }, [totalCount, activeTabId]);

  // Effect to cache the latest total count on the active tab object itself
  useEffect(() => {
    const activeTab = uploads.tabs.find(t => t.id === activeTabId);
    if (activeTab && totalCount !== activeTab.stats?.total) {
      uploads.updateTab(activeTabId, {
        stats: { ...activeTab.stats, total: totalCount }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, activeTabId]);

  /* ------------------------------ actions ------------------------------ */
  const onRowClick = (row) => { setViewing(row); open("detailsOpen"); };
  const onEdit = (row) => { setEditing(row); open("editOpen"); };

  const onDeleteSingle = (id) => {
    selection.clear();
    selection.selectIds([id]);
    open("deleteOpen");
  };

  const confirmDelete = async () => { // Made async
    const ids = selection.selectedIds;
    if (!ids.length) { close("deleteOpen"); return; }

    if (isDB || activeUploadTab?.isPersistent) {
      await api.bulkDeleteContacts(Array.from(ids)); // Call API
      await api.fetchContacts(queryParams); // Re-fetch to get the correct list
    } else {
      const next = uploadRows.filter((r) => !ids.includes(r.id));
      uploads.updateTab(activeTabId, { rows: next });
    }

    selection.clear();
    close("deleteOpen");
  };

  const handleAddSubmit = async (contact) => { // Made async
    if (isDB || activeUploadTab?.isPersistent) {
      await api.createContact(contact, activeUploadTab?.groupId);
      await api.fetchContacts(queryParams); // Re-fetch to get the correct list
    } else {
      const next = [...uploadRows, { ...contact, id: contact.id || `u_${Date.now().toString(36)}` }];
      uploads.updateTab(activeTabId, { rows: next });
    }
    close("addOpen");
  };

  const handleEditSubmit = async (id, patch) => { // Made async
    if (isDB || activeUploadTab?.isPersistent) {
      await api.updateContact(id, patch);
    } else {
      const next = uploadRows.map((r) => (r.id === id ? { ...r, ...patch } : r));
      uploads.updateTab(activeTabId, { rows: next });
    }
    close("editOpen");
  };

  const handleImport = async (file) => {
    const activeGroupId = activeTabId === 'db' ? undefined : activeUploadTab?.groupId;
    await api.importContacts(file, activeGroupId);
    // Re-fetch contacts for the current view to show the new imports
    await api.fetchContacts(queryParams);
  };

  const handleExport = async (format, filters) => { // Added handleExport
    const activeGroupId = activeTabId === 'db' ? undefined : activeUploadTab?.groupId;
    const finalFilters = { ...filters, groupId: activeGroupId };
    await api.exportContacts(format, finalFilters);
  };

  const handleCreateGroup = async (name) => {
    if (!name || !name.trim()) return;
    const newGroup = await api.createGroup({ name: name.trim() });
    if (newGroup) {
      const newTabIds = uploads.addGroups([newGroup]);
      if (newTabIds?.length) setActiveTabId(newTabIds[0]);
    }
    close("newGroupOpen");
  };

  const handleCreateGroupsFromSheets = async (sheets) => {
    if (!sheets || sheets.length === 0) return;

    console.log("Creating groups from sheets:", sheets);
    const newTabIds = [];
    for (const sheet of sheets) {
      try {
        const newGroupPayload = {
          name: sheet.name,
          contacts: sheet.rows,
        };
        const newGroup = await api.createGroup(newGroupPayload);
        if (newGroup) {
          const ids = uploads.addGroups([newGroup]);
          if (ids?.length) newTabIds.push(ids[0]);
        }
      } catch (error) {
        console.error(`Failed to create group for sheet: ${sheet.name}`, error);
      }
    }

    if (newTabIds.length > 0) {
      setActiveTabId(newTabIds[0]);
    }
    close("importOpen");
  };

  const handleRenameGroup = async (tabId, newName) => {
    const tab = uploads.tabs.find(t => t.id === tabId);
    if (tab && tab.isPersistent) {
      try {
        await api.renameGroup(tab.groupId, newName);
        uploads.updateTab(tabId, { name: newName });
      } catch (error) {
        console.error("Failed to rename group:", error);
      }
    }
  };

  /* --------- campaign options (passed to ImportContactsModal) --------- */
  const CAMPAIGN_OPTIONS = useMemo(
    () => [
      "Welcome Series",
      "Re-engagement",
      "VIP Outreach",
      "Trial Follow-up",
      "NPS Survey",
      "Promo Q4",
      "Churn Rescue",
    ],
    []
  );

  /* ------------------------------ counts for tabs header ------------------------------ */
  const tabsWithCounts = useMemo(() => {
    const items = [{
      id: "db",
      label: "All",
      icon: "db",
      closable: false,
      count: mainDbTotal,
      visible: true, // The "All" tab is always visible
    }];
    uploads.tabs.forEach((t) => {
      items.push({
        id: t.id,
        label: t.name,
        icon: "xls",
        closable: true,
        count: t.stats?.total || 0,
        visible: t.visible, // Pass visibility state
      });
    });
    return items;
  }, [uploads.tabs, mainDbTotal]);

  /* -------------------------------- render -------------------------------- */
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      {/* Title & page note */}
      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
        <Typography variant="h5">Contacts</Typography>
        <Typography variant="body2" color="text.secondary">
          Your Contacts (DB) contain the richest profile. Uploading an Excel/CSV creates additional tabs—one per sheet—each
          lightweight but editable.
        </Typography>
      </Stack>

      {/* Tabs header */}
      <ContactsTabs
        value={activeTabId}
        onChange={setActiveTabId}
        tabs={tabsWithCounts}
        onClose={async (tabIdToClose) => {
          // Find the tab object to check if it's persistent
          const tab = uploads.tabs.find(t => t.id === tabIdToClose);

          // If it's a persistent tab, call the backend to delete it
          if (tab && tab.isPersistent) {
            try {
              await api.deleteGroup(tab.groupId);
            } catch (error) {
              console.error("Failed to delete group:", error);
              // Optionally, show an error to the user
              return; // Stop if the API call fails
            }
          }

          // If the API call was successful (or if it wasn't a persistent tab), remove it from the local UI state
          uploads.removeTab(tabIdToClose);
        }}
        onOpenImport={() => open("importOpen")}
        onOpenNewGroup={() => open("newGroupOpen")}
        onRename={handleRenameGroup}
        onToggleVisibility={uploads.toggleTabVisibility}
      />

      {/* Toolbar */}
      <Box sx={{ mt: 1.25 }}>
        <ContactsToolbar
          query={queryParams}
          onQueryChange={(patch) => {
            const needsReset =
              "search" in patch || "sortBy" in patch || "sortDir" in patch || "filters" in patch || "pageSize" in patch;
            setQueryParams({ ...queryParams, ...patch, page: needsReset ? 0 : patch.page ?? queryParams.page });
          }}
          onOpenAdd={() => open("addOpen")}
          onOpenExport={() => open("exportOpen")}
          onOpenFilter={() => open("filterOpen")}
          context={context}
          totalCount={totalCount}
          campaignOptions={CAMPAIGN_OPTIONS}
        />
      </Box>

      {/* Bulk actions bar */}
      <BulkBar
        count={selection.count}
        onClear={selection.clear}
        onDelete={() => open("deleteOpen")}
        onExport={() => open("exportOpen")}
      />

      {/* Table */}
      <Box sx={{ mt: 1 }}>
        <ContactsTable
          rows={pagedCurrent}
          columns={DEFAULT_COLUMNS}
          page={queryParams.page}
          pageSize={queryParams.pageSize}
          total={totalCount}
          onPageChange={(p) => setQueryParams({ ...queryParams, page: p })}
          onPageSizeChange={(ps) => setQueryParams({ ...queryParams, pageSize: ps, page: 0 })}
          selection={selection}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDeleteSingle}
          loading={false}
          dense
        />
      </Box>

      {/* Drawers */}
      <ContactDetailsDrawer
        open={ui.detailsOpen}
        contact={viewing}
        onClose={() => close("detailsOpen")}
        onEdit={onEdit}
        onDelete={(id) => { onDeleteSingle(id); close("detailsOpen"); }}
        onCall={(id) => callContact?.(id)}
      />
      {ui.editOpen && editing && (
        <EditContactDrawer
          open={ui.editOpen}
          contact={editing}
          onClose={() => close("editOpen")}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Modals */}
      <AddContactModal
        open={ui.addOpen}
        onClose={() => close("addOpen")}
        onSubmit={handleAddSubmit}
      />
      <DeleteConfirmModal
        open={ui.deleteOpen}
        onClose={() => close("deleteOpen")}
        onConfirm={confirmDelete}
        count={selection.count}
      />
      <ExportContactsModal
        open={ui.exportOpen}
        onClose={() => close("exportOpen")}
        rows={dbRows}
        selectedIds={selection.selectedIds}
        byId={dbById}
        onExport={handleExport} // Added onExport prop
      />
      <FilterContactsModal
        open={ui.filterOpen}
        onClose={() => close("filterOpen")}
        initialFilters={queryParams.filters}
        onApply={(filters) => {
          setQueryParams({ ...queryParams, filters, page: 0 });
          close("filterOpen");
        }}
      />
      <ImportContactsModal
        open={ui.importOpen}
        onClose={() => close("importOpen")}
        onImportToActiveGroup={(file) => {
          handleImport(file);
          close("importOpen");
        }}
        onImportAsNewGroups={handleCreateGroupsFromSheets}
        isDbTabActive={isDB}
        campaignOptions={CAMPAIGN_OPTIONS}
      />
      <NewGroupDialog
        open={ui.newGroupOpen}
        onClose={() => close("newGroupOpen")}
        onCreate={handleCreateGroup}
      />
    </Box>
  );
}

// Simple dialog for creating a new sheet
function NewGroupDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    onCreate(name);
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

