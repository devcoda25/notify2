import React from "react";
import TemplatesContentFrame from "./layout/TemplatesContentFrame";

// Views
import AllTemplatesView from "./views/AllTemplatesView.jsx";
import ChannelTemplatesView from "./views/ChannelTemplatesView.jsx";
import TemplateDetailView from "./views/TemplateDetailView.jsx";
import ApprovalsCenterView from "./views/ApprovalsCenterView.jsx";
import CreateTemplateWizardView from "./views/CreateTemplateWizardView.jsx";
import NotFoundView from "./views/NotFoundView.jsx";

const VIEWS = Object.freeze({
  ALL: "all",
  CHANNEL: "channel",
  DETAIL: "detail",
  APPROVALS: "approvals",
  THEMES: "themes",
  STATS: "stats",
  SETTINGS: "settings",
  CREATE: "create",
});

const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

export default function TemplatesApp() {
  const [currentView, setCurrentView] = React.useState(VIEWS.ALL);
  const [selectedChannel, setSelectedChannel] = React.useState("all");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(null);

  const [approvalsInit, setApprovalsInit] = React.useState({ tab: "all", state: "Submitted" });

  const handleNavigate = (view, channel) => {
    if (channel) setSelectedChannel(channel);
    setCurrentView(view || VIEWS.ALL);
  };

  const handleOpenTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setCurrentView(VIEWS.DETAIL);
  };

  const handleCreate = () => {
    setCurrentView(VIEWS.CREATE);
  };

  const openInApprovals = (template) => {
    const tab = normalizeChannel(template?.channel) || "all";
    const state = template?.status || template?.state || "Submitted";
    setApprovalsInit({ tab, state });
    setCurrentView(VIEWS.APPROVALS);
  };

  let content = null;
  switch (currentView) {
    case VIEWS.ALL:
      content = (
        <AllTemplatesView
          onOpenTemplate={handleOpenTemplate}
          onOpenApprovals={openInApprovals}
          onCreateTemplate={handleCreate}            
        />
      );
      break;
    case VIEWS.CHANNEL:
      content = (
        <ChannelTemplatesView
          channel={selectedChannel}
          onOpenTemplate={handleOpenTemplate}
          onOpenApprovals={openInApprovals}
          // ChannelTemplatesView doesn’t show ChannelTabs, so no button here
        />
      );
      break;
    case VIEWS.DETAIL:
      content = selectedTemplateId ? (
        <TemplateDetailView templateId={selectedTemplateId} />
      ) : (
        <NotFoundView />
      );
      break;
    case VIEWS.APPROVALS:
      content = (
        <ApprovalsCenterView
          onOpenTemplate={handleOpenTemplate}
          initialTab={approvalsInit.tab}
          initialState={approvalsInit.state}
          onCreateTemplate={handleCreate}            
        />
      );
      break;
    case VIEWS.CREATE:
      content = (
        <CreateTemplateWizardView
          defaultChannel={selectedChannel !== "all" ? selectedChannel : "email"}
          onDone={(newTemplateId) => {
            if (newTemplateId) {
              setSelectedTemplateId(newTemplateId);
              setCurrentView(VIEWS.DETAIL);
            } else {
              setCurrentView(VIEWS.ALL);
            }
          }}
        />
      );
      break;
    default:
      content = <NotFoundView />;
  }

  return (
    <TemplatesContentFrame
      currentView={currentView}
      selectedChannel={selectedChannel}
      onNavigate={handleNavigate}
      // onCreateTemplate prop is unused by the frame now; views own the button
    >
      {content}
    </TemplatesContentFrame>
  );
}
