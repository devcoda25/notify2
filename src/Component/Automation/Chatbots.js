import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Tooltip,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Search, Upload, PlayCircle } from "lucide-react";

import DeleteModal from "../DeleteModal";
import CopyandAddModal from "./PopupModal/Chatbot/CopyandAddModal";
import FlowTemplates from "./PopupModal/Chatbot/FlowTemplates";
import NotificationModal from "./PopupModal/Chatbot/NotificationModal";
import FallbackMessageModal from "./PopupModal/Chatbot/FallbackMessageModal";
import ChatbotTimerModal from "./PopupModal/Chatbot/ChatbotTimerModal";
import CustomPagination from "../CustomPagination";
import TableComponent from "../TableComponent";

import { useFlowsStore } from "./Chatbots/flowbuilder/store/flows";

const Chatbots = ({ handleEditChatbotbutton }) => {
  const theme = useTheme();

  const { flows, deleteFlow, setActiveFlow } = useFlowsStore();

  const [state, setState] = useState({
    searchChatbots: "",
    page: 0,
    rowsPerPage: 5,
    isOpenFallbackMessage: false,
    isOpenChatbotTimer: false,
    isOpenDeleteModal: false,
    rowIndexToDelete: null,
    isOpenCopyModal: false,
    isOpenTemplatePage: false,
    isOpenNotificationModal: false,
  });

  const updateState = (patch) => setState((s) => ({ ...s, ...patch }));

  /** ---------- Derived ---------- */
  const limit = 20; // if this comes from settings, swap it in
  const countLabel = useMemo(
    () => `${flows.length}/${limit}`,
    [flows.length]
  );

  const filtered = useMemo(() => {
    const q = state.searchChatbots.trim().toLowerCase();
    if (!q) return flows;
    return flows.filter((f) => (f.title || "").toLowerCase().includes(q));
  }, [flows, state.searchChatbots]);

  const pageRows = useMemo(
    () =>
      filtered.slice(
        state.page * state.rowsPerPage,
        state.page * state.rowsPerPage + state.rowsPerPage
      ),
    [filtered, state.page, state.rowsPerPage]
  );

  /** ---------- Handlers ---------- */
  const handleChangePage = (_, newPage) => updateState({ page: newPage });

  const handleChangeRows = (e) =>
    updateState({ rowsPerPage: parseInt(e.target.value, 10) || 5, page: 0 });

  const openTemplates = () => updateState({ isOpenTemplatePage: true });
  const openNotification = () =>
    updateState({ isOpenNotificationModal: true, isOpenTemplatePage: false });
  const closeNotification = () =>
    updateState({ isOpenNotificationModal: false });

  const openFallback = () => updateState({ isOpenFallbackMessage: true });
  const closeFallback = () => updateState({ isOpenFallbackMessage: false });

  const openTimer = () => updateState({ isOpenChatbotTimer: true });
  const closeTimer = () => updateState({ isOpenChatbotTimer: false });

  const openCopy = () => updateState({ isOpenCopyModal: true });
  const closeCopy = () => updateState({ isOpenCopyModal: false });
  const saveCopy = () =>
    updateState({ isOpenCopyModal: false, isOpenNotificationModal: true });

  const openDelete = (flowId) =>
    updateState({ rowIndexToDelete: flowId, isOpenDeleteModal: true });
  const closeDelete = () =>
    updateState({ rowIndexToDelete: null, isOpenDeleteModal: false });
  const confirmDelete = () => {
    if (state.rowIndexToDelete !== null) deleteFlow(state.rowIndexToDelete);
    closeDelete();
  };

  const handleEdit = (flowId) => {
    setActiveFlow(flowId);
    handleEditChatbotbutton?.();
  };

  // FlowTemplates needs a save callback even if you only navigate afterwards
  const handleSaveTemplate = () =>
    updateState({ isOpenTemplatePage: false, isOpenNotificationModal: true });

  /** ---------- Columns for TableComponent ---------- */
  const columns = [
    { id: "name", label: "Name" },
    { id: "triggered", label: "Triggered" },
    { id: "stepsFinished", label: "Steps Finished" },
    { id: "finished", label: "Finished" },
    { id: "modifiedOn", label: "Modified On" },
  ];

  const renderCell = (row, column) => {
    if (column.id === "name") {
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {row.name || row.title}
          </Typography>
        </Stack>
      );
    }
    return row[column.id];
  };

  /** ---------- Layout ---------- */
  if (state.isOpenTemplatePage) {
    return (
      <FlowTemplates
        onEdit={handleEdit}
        handleNotificationModal={openNotification}
        handleEditChatbotbutton={handleEditChatbotbutton}
        onSave={handleSaveTemplate}
      />
    );
  }

  return (
    <>
      {/* Modals */}
      {state.isOpenDeleteModal && (
        <DeleteModal
          show={state.isOpenDeleteModal}
          onClose={closeDelete}
          onConfirm={confirmDelete}
          msg="Do you want to remove this chatbot?"
        />
      )}

      {state.isOpenNotificationModal && (
        <NotificationModal
          show={state.isOpenNotificationModal}
          msg="The limit on chatbots is reached and the chatbot cannot be created."
          value={String(limit)}
          onClose={closeNotification}
        />
      )}

      {state.isOpenFallbackMessage && (
        <FallbackMessageModal
          show={state.isOpenFallbackMessage}
          onClose={closeFallback}
          onSave={closeFallback}
        />
      )}

      {state.isOpenChatbotTimer && (
        <ChatbotTimerModal
          show={state.isOpenChatbotTimer}
          onClose={closeTimer}
          onSave={closeTimer}
        />
      )}

      {state.isOpenCopyModal && (
        <CopyandAddModal
          show={state.isOpenCopyModal}
          onClose={closeCopy}
          onSave={saveCopy}
          placeholder="Chatbot Name"
          buttonLabel="Copy"
        />
      )}

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          mb: 1.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          {/* Left group: title + search + tutorial */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", md: "center" }}
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Chatbots
              </Typography>
              <Chip
                size="small"
                label={countLabel}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.dark,
                }}
              />
            </Stack>

            <TextField
              size="small"
              placeholder="Search chatbots…"
              value={state.searchChatbots}
              onChange={(e) => updateState({ searchChatbots: e.target.value, page: 0 })}
              sx={{
                minWidth: { xs: "100%", md: 280 },
                "& .MuiInputBase-root": { height: 40 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />

            <Tooltip title="Watch tutorial">
              <Button
                variant="text"
                size="small"
                startIcon={<PlayCircle size={18} />}
                href="https://www.youtube.com/watch?v=zNCNTsGDbXM"
                target="_blank"
                rel="noreferrer"
                sx={{ px: 1 }}
              >
                Watch Tutorial
              </Button>
            </Tooltip>
          </Stack>

          {/* Right group: actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" size="small" onClick={openFallback}>
              Fallback Message
            </Button>
            <Button variant="outlined" size="small" onClick={openTimer}>
              Chatbot Timer
            </Button>

            <Tooltip title="Import">
              <IconButton size="small">
                <Upload size={18} />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              onClick={openTemplates}
              sx={{ minWidth: 120 }}
            >
              Add Chatbot
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: { xs: 1, sm: 1.25 } }}>
          <TableComponent
            columns={columns}
            data={pageRows}
            customRenderCell={renderCell}
            onDelete={openDelete}
            showCopy
            onEdit={handleEdit}
            onCopy={openCopy}
            actionHeaderLabel="Actions"
          />
        </Box>

        <Divider />

        <Box sx={{ p: 1 }}>
          <CustomPagination
            count={filtered.length}
            rowsPerPage={state.rowsPerPage}
            page={state.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRows}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Chatbots;
