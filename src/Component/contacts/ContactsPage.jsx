// /src/Component/contacts/ContactsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
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

import useContactsQueryState from "./hooks/useContactsQueryState";
import useSelection from "./hooks/useSelection";
import useUploadWorkspace from "./hooks/useUploadWorkspace";

import { useContactsStore } from "../store/useContactsStore";
import { DEFAULT_COLUMNS } from "./utils/mappers";

/* ------------------------------ helpers ------------------------------ */
const toLower = (v) => String(v || "").toLowerCase();
const pickAttrText = (attrs) => (Array.isArray(attrs) ? attrs.map((a) => `${a.key}:${a.value}`) : []);

function matchesSearch(contact, search) {
  if (!search) return true;
  const s = toLower(search);
  const hay = [
    contact?.name,
    contact?.email,
    contact?.company,
    contact?.title,
    contact?.source,
    contact?.phone,
    ...pickAttrText(contact?.attributes),
  ]
    .filter(Boolean)
    .map(toLower)
    .join(" | ");
  return hay.includes(s);
}

function applyFiltersArr(arr, filters) {
  if (!filters || !Object.keys(filters).length) return arr;
  const src = filters.source || null;
  const tags = Array.isArray(filters.tags) ? filters.tags : null;
  return arr.filter((c) => {
    const okSource = src ? String(c.source || "") === String(src) : true;
    const okTags = tags
      ? (Array.isArray(c.attributes) ? c.attributes.map((t) => t.value) : []).some((v) => tags.includes(v))
      : true;
    return okSource && okTags;
  });
}

function sortRows(arr, sortBy = "lastUpdated", dir = "desc") {
  const mul = dir === "asc" ? 1 : -1;
  const val = (c, k) => {
    if (k === "name") return toLower(c?.name || "");
    if (k === "createdAt") return +new Date(c?.createdAt || c?.created_at || 0);
    // lastUpdated default
    return +new Date(c?.updatedAt || c?.updated_at || c?.lastUpdated || c?.last_updated || 0);
  };
  return [...arr].sort((a, b) => {
    const av = val(a, sortBy);
    const bv = val(b, sortBy);
    if (typeof av === "string") return mul * av.localeCompare(bv);
    return mul * (av - bv);
  });
}

function paginate(arr, page = 0, pageSize = 25) {
  const start = page * pageSize;
  return arr.slice(start, start + pageSize);
}

function ensureIds(rows, prefix = "u") {
  return rows.map((r, i) => ({
    id: r.id || `${prefix}_${i}_${Math.random().toString(36).slice(2, 6)}`,
    ...r,
  }));
}

/* -------------------------- DEMO DATA GENERATOR -------------------------- */
const DEMO_COUNT = 600;
const DEMO_SEED = 1337;

// PRNG
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const randint = (rnd, min, max) => Math.floor(rnd() * (max - min + 1)) + min;
const pickMany = (arr, n, rnd) => {
  const copy = [...arr];
  const out = [];
  const count = Math.max(0, Math.min(n, arr.length));
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rnd() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};
const chance = (rnd, p = 0.5) => rnd() < p;

const firsts = [
  "Aisha", "Brian", "Daniel", "Emily", "Fatima", "Grace", "Henry", "Ivan", "Jackie", "Khalid",
  "Liam", "Maria", "Noah", "Olivia", "Peter", "Queen", "Ryan", "Sarah", "Tina", "Victor", "Winnie", "Yusuf", "Zara",
];
const lasts = [
  "Akello", "Bakshi", "Chebet", "Daka", "Ekere", "Faisal", "Gatera", "Hassan", "Ibrahim", "Juma",
  "Kato", "Lutalo", "Mukasa", "Nabirye", "Okello", "Peters", "Qureshi", "Rwabugahya", "Sebunya",
  "Tumusiime", "Umar", "Wamala", "Zziwa",
];
const companies = ["EVzone", "Kampower", "GreenGrid", "Sunlite", "SwiftRide", "PayFlow", "CargoX", "HealthPlus", "FarmLink", "BlueWave"];
const titles = ["Analyst", "Coordinator", "Manager", "Engineer", "Owner", "Director", "Specialist", "Consultant", "Agent", "Lead"];
const channels = ["Calls", "SMS", "WhatsApp", "Email"];
const tags = ["VIP", "Trial", "Churn-risk", "Prospect", "Partner", "UG-KLA", "UG-WAK", "EN", "SW", "LG"];

const languagesAll = [["English"], ["English", "Luganda"], ["English", "Swahili"]];
const timezones = ["Africa/Kampala", "Africa/Nairobi", "Africa/Dar_es_Salaam"];
const locations = [
  { city: "Kampala", region: "Central", country: "Uganda" },
  { city: "Wakiso", region: "Central", country: "Uganda" },
  { city: "Mbarara", region: "Western", country: "Uganda" },
  { city: "Gulu", region: "Northern", country: "Uganda" },
  { city: "Jinja", region: "Eastern", country: "Uganda" },
];

const devicesAll = ["Android", "iPhone", "Desktop", "Tablet"];
const servicesAll = ["Wallet", "Rides", "TeleHealth", "EnergyPay", "EV Charging", "Agri Loans", "Insights"];
const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
const lifecycle = ["Prospect", "Active", "Churn Risk", "Dormant"];
const kycStates = ["verified", "pending", "failed"];
const acquisitions = ["Referral", "Paid Ads", "SEO", "Partner", "Walk-in"];
const referrers = ["—", "John Doe", "Radio Promo", "Campus Ambassador", "NGO Partner"];
const windows = ["8am–12pm", "12pm–4pm", "4pm–8pm", "Anytime"];

function makeUGPhone(rnd) {
  const prefix = pick(["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"], rnd);
  const rest = String(Math.floor(rnd() * 1_000_0000)).padStart(7, "0");
  return `+256 ${prefix}${rest.slice(0, 1)} ${rest.slice(1, 4)} ${rest.slice(4)}`;
}

function makeDemoContacts(n = DEMO_COUNT, seed = DEMO_SEED) {
  const rnd = mulberry32(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const first = pick(firsts, rnd), last = pick(lasts, rnd);
    const name = `${first} ${last}`;
    const email = `${first}.${last}${Math.floor(rnd() * 100)}@example.com`.toLowerCase().replace(/\s+/g, "");
    const e164 = makeUGPhone(rnd);
    const company = pick(companies, rnd);
    const title = pick(titles, rnd);
    const preferredChannel = pick(channels, rnd);
    const createdAt = new Date(Date.now() - randint(rnd, 0, 90) * 86400000).toISOString();
    const updatedAt = new Date(Date.now() - randint(rnd, 0, 15) * 86400000).toISOString();

    // attributes (tags)
    const attrCount = 1 + randint(rnd, 0, 2);
    const attributes = Array.from({ length: attrCount }, () => ({ key: "tag", value: pick(tags, rnd) }));

    // phones array (sometimes add a second "Work" number)
    const phones = chance(rnd, 0.35)
      ? [{ label: "Mobile", e164 }, { label: "Work", e164: makeUGPhone(rnd) }]
      : [{ label: "Mobile", e164 }];

    // opt-in prefs
    const optIn = {
      email: chance(rnd, 0.8),
      sms: chance(rnd, 0.7),
      whatsapp: chance(rnd, 0.65),
      calls: chance(rnd, 0.6),
    };

    // devices & services
    const devCount = randint(rnd, 1, 3);
    const devList = pickMany(devicesAll, devCount, rnd);
    const devices = { all: devList, mostUsed: pick(devList, rnd) };

    const consumed = pickMany(servicesAll, randint(rnd, 1, 4), rnd);
    const services = {
      consumed,
      mostUsed: consumed.length ? pick(consumed, rnd) : null,
      newlyJoined: pickMany(servicesAll.filter(s => !consumed.includes(s)), chance(rnd, 0.5) ? 1 : 0, rnd),
      rarelyUsed: pickMany(consumed, chance(rnd, 0.4) ? 1 : 0, rnd),
      neverUsed: servicesAll.filter(s => !consumed.includes(s)).slice(0, randint(rnd, 0, 2)),
    };

    // identity & account
    const ids = { crmId: `CRM-${100000 + randint(rnd, 0, 899999)}` };
    const languages = pick(languagesAll, rnd);
    const timezone = pick(timezones, rnd);
    const location = pick(locations, rnd);
    const segmentTier = pick(tiers, rnd);
    const lifecycleStage = pick(lifecycle, rnd);
    const riskScore = randint(rnd, 5, 95);
    const kycStatus = pick(kycStates, rnd);
    const acquisition = pick(acquisitions, rnd);
    const referrer = pick(referrers, rnd);
    const preferredWindow = pick(windows, rnd);

    // engagement
    const score = randint(rnd, 10, 95);
    const engagement = {
      score,
      lastChannel: pick(channels, rnd),
      lastContactAt: new Date(Date.now() - randint(rnd, 0, 21) * 86400000).toISOString(),
      appointmentsMissed: randint(rnd, 0, 3),
      casesCount: randint(rnd, 0, 6),
      campaign: chance(rnd, 0.5) ? pick(["Welcome Series", "Re-engagement", "VIP Outreach", "Trial Follow-up", "NPS Survey", "Promo Q4", "Churn Rescue"], rnd) : null,
      csat: chance(rnd, 0.65) ? randint(rnd, 2, 5) : null,
      nps: chance(rnd, 0.5) ? randint(rnd, -20, 100) : null,
      lastFeedback: chance(rnd, 0.4) ? pick(["Great support", "Too many messages", "Pricing unclear", "Loves new feature", "Slow response"], rnd) : null,
    };

    out.push({
      id: `c_${i + 1}`,
      name,
      email,
      phone: e164, // keep legacy single phone for table/search
      phones,
      company,
      title,
      preferredChannel,
      source: "demo",
      _origin: "db",
      attributes,
      createdAt,
      updatedAt,

      // new/richer fields the drawer will show
      optIn,
      devices,
      services,
      ids,
      languages,
      timezone,
      location,
      segmentTier,
      lifecycleStage,
      riskScore,
      kycStatus,
      acquisition,
      referrer,
      preferredWindow,
      engagement,
    });
  }
  return out;
}

/* ------------------------------ component ------------------------------ */
export default function ContactsPage() {
  // Query & uploads
  const query = useContactsQueryState({ initial: { pageSize: 25 } });
  const uploads = useUploadWorkspace();

  // Store (DB)
  const byId = useContactsStore((s) => s.data.byId);
  const order = useContactsStore((s) => s.data.order);
  const hydrate = useContactsStore((s) => s.hydrate);
  const addContact = useContactsStore((s) => s.addContact);
  const updateContact = useContactsStore((s) => s.updateContact);
  const bulkRemove = useContactsStore((s) => s.bulkRemove);
  const callContact = useContactsStore((s) => s.callContact);

  // Build DB rows
  const dbRows = useMemo(
    () => order.map((id) => byId[id]).filter(Boolean).map((r) => ({ ...r, _origin: "db" })),
    [byId, order]
  );
  const dbById = useMemo(() => Object.fromEntries(dbRows.map((r) => [r.id, r])), [dbRows]);

  // Seed demo DB rows once if empty
  useEffect(() => {
    if ((order?.length || 0) === 0) {
      hydrate(makeDemoContacts());
    }
  }, [order?.length, hydrate]);

  /* --------------------------- tabs & context --------------------------- */
  const tabs = useMemo(() => {
    const items = [{ id: "db", label: "Contacts", icon: "db", closable: false }];
    uploads.tabs.forEach((t) => items.push({ id: t.id, label: t.name, icon: "xls", closable: true }));
    return items;
  }, [uploads.tabs]);

  const [activeTabId, setActiveTabId] = useState("db");

  useEffect(() => {
    if (activeTabId !== "db" && !uploads.tabs.some((t) => t.id === activeTabId)) {
      setActiveTabId("db");
    }
  }, [activeTabId, uploads.tabs]);

  const isDB = activeTabId === "db";
  const context = isDB ? "db" : "upload";

  // Current tab rows (uploads get stable ids via ensureIds)
  const activeUploadTab = uploads.tabs.find((t) => t.id === activeTabId) || null;
  const uploadRowsRaw = activeUploadTab?.rows || [];
  const uploadRows = useMemo(
    () => ensureIds(uploadRowsRaw.map((r) => ({ ...r, _origin: "upload" })), activeTabId.slice(0, 6)),
    [uploadRowsRaw, activeTabId]
  );

  const allRowsCurrentTab = isDB ? dbRows : uploadRows;

  /* ------------------ filter/sort/paginate (current tab) ------------------ */
  const filteredCurrent = useMemo(() => {
    const arr = allRowsCurrentTab.filter((r) => matchesSearch(r, query.debouncedSearch));
    return applyFiltersArr(arr, query.state.filters);
  }, [allRowsCurrentTab, query.debouncedSearch, query.state.filters]);

  const sortedCurrent = useMemo(
    () => sortRows(filteredCurrent, query.state.sortBy, query.state.sortDir),
    [filteredCurrent, query.state.sortBy, query.state.sortDir]
  );

  const pagedCurrent = useMemo(
    () => paginate(sortedCurrent, query.state.page, query.state.pageSize),
    [sortedCurrent, query.state.page, query.state.pageSize]
  );

  const pageIds = useMemo(() => pagedCurrent.map((r) => r.id), [pagedCurrent]);
  const allIdsFiltered = useMemo(() => filteredCurrent.map((r) => r.id), [filteredCurrent]);

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
  });
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const open = (k) => setUi((s) => ({ ...s, [k]: true }));
  const close = (k) => setUi((s) => ({ ...s, [k]: false }));

  /* ------------------------------ actions ------------------------------ */
  const onRowClick = (row) => { setViewing(row); open("detailsOpen"); };
  const onEdit = (row) => { setEditing(row); open("editOpen"); };

  const onDeleteSingle = (id) => {
    selection.clear();
    selection.selectIds([id]);
    open("deleteOpen");
  };

  const confirmDelete = () => {
    const ids = selection.selectedIds;
    if (!ids.length) { close("deleteOpen"); return; }

    if (isDB) {
      bulkRemove(ids);
    } else {
      const next = uploadRows.filter((r) => !ids.includes(r.id));
      uploads.updateTab(activeTabId, { rows: next });
    }

    selection.clear();
    close("deleteOpen");
  };

  const handleAddSubmit = (contact) => {
    if (isDB) {
      addContact(contact);
    } else {
      const next = [...uploadRows, { ...contact, id: contact.id || `u_${Date.now().toString(36)}` }];
      uploads.updateTab(activeTabId, { rows: next });
    }
    close("addOpen");
  };

  const handleEditSubmit = (patch) => {
    if (isDB) {
      updateContact(patch.id, patch);
    } else {
      const next = uploadRows.map((r) => (r.id === patch.id ? { ...r, ...patch } : r));
      uploads.updateTab(activeTabId, { rows: next });
    }
    close("editOpen");
  };

  const handleImport = (sheets) => {
    // Each sheet -> new tab inside UploadWorkspace
    const ids = uploads.addWorkbook(sheets);
    if (ids?.length) setActiveTabId(ids[0]);
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
    const buildCount = (rows) =>
      applyFiltersArr(rows.filter((r) => matchesSearch(r, query.debouncedSearch)), query.state.filters).length;
    const items = [{ id: "db", label: "Contacts", icon: "db", closable: false, count: buildCount(dbRows) }];
    uploads.tabs.forEach((t) => {
      const rows = ensureIds((t.rows || []).map((r) => ({ ...r, _origin: "upload" })), t.id.slice(0, 6));
      items.push({ id: t.id, label: t.name, icon: "xls", closable: true, count: buildCount(rows) });
    });
    return items;
  }, [uploads.tabs, dbRows, query.debouncedSearch, query.state.filters]);

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
        onClose={(id) => uploads.removeTab(id)}
        onOpenImport={() => open("importOpen")}
      />

      {/* Toolbar */}
      <Box sx={{ mt: 1.25 }}>
        <ContactsToolbar
          query={query.state}
          onQueryChange={(patch) => {
            const needsReset =
              "search" in patch || "sortBy" in patch || "sortDir" in patch || "filters" in patch || "pageSize" in patch;
            query.setQuery({ ...patch, page: needsReset ? 0 : patch.page ?? query.state.page });
          }}
          onOpenAdd={() => open("addOpen")}
          onOpenExport={() => open("exportOpen")}
          onOpenFilter={() => open("filterOpen")}
          context={context}
          totalCount={filteredCurrent.length}
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
          page={query.state.page}
          pageSize={query.state.pageSize}
          total={filteredCurrent.length}
          onPageChange={(p) => query.setQuery({ page: p })}
          onPageSizeChange={(ps) => query.setQuery({ pageSize: ps, page: 0 })}
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
        rows={filteredCurrent}
        selectedIds={selection.selectedIds}
        byId={isDB ? dbById : Object.fromEntries(allRowsCurrentTab.map((r) => [r.id, r]))}
      />
      <FilterContactsModal
        open={ui.filterOpen}
        onClose={() => close("filterOpen")}
        initialFilters={query.state.filters}
        onApply={(filters) => {
          query.setQuery({ filters, page: 0 });
          close("filterOpen");
        }}
      />
      <ImportContactsModal
        open={ui.importOpen}
        onClose={() => close("importOpen")}
        onImported={(sheets) => {
          handleImport(sheets);
          close("importOpen");
        }}
        campaignOptions={CAMPAIGN_OPTIONS}
      />
    </Box>
  );
}
