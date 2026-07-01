document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.jsReady = "true";

  const STORAGE_KEY = "talentisOS_state_v1";
  const SCHEMA_VERSION = 1;

  let appState = null;

  const canRegisterServiceWorker =
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  if (canRegisterServiceWorker) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("./service-worker.js");
      } catch (_error) {
        // Fail quietly so local file opens stay clean.
      }
    });
  }

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-navigation");
  const desktopNav = document.querySelector(".site-nav--desktop");
  const quickActions = document.querySelector(".site-header__quick-actions");
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll(".mobile-menu__link")
    : [];
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sections = document.querySelectorAll("[data-view-section]");
  const revealItems = document.querySelectorAll(".reveal");
  const yearNode = document.querySelector("#current-year");
  const toastStack = document.querySelector("[data-toast-stack]");
  const lastSavedNode = document.querySelector("[data-last-saved]");
  const schemaVersionNode = document.querySelector("[data-schema-version]");
  const exportTrigger = document.querySelector("[data-export-state]");
  const importTrigger = document.querySelector("[data-import-trigger]");
  const importInput = document.querySelector("[data-import-input]");
  const resetSampleTrigger = document.querySelector("[data-reset-sample]");
  const clearDataTrigger = document.querySelector("[data-clear-data]");
  const peopleDueNode = document.querySelector("[data-people-due]");
  const kpiExceptionsNode = document.querySelector("[data-kpi-exceptions]");
  const openIssuesNode = document.querySelector("[data-open-issues]");
  const trainingRiskNode = document.querySelector("[data-training-risk]");
  const healthScoreNode = document.querySelector("[data-health-score]");
  const countTeamMembersNode = document.querySelector("[data-count-team-members]");
  const countOpenTasksNode = document.querySelector("[data-count-open-tasks]");
  const countMeetingsNode = document.querySelector("[data-count-meetings]");
  const countKpisNode = document.querySelector("[data-count-kpis]");
  const countIssuesNode = document.querySelector("[data-count-issues]");
  const countSopsNode = document.querySelector("[data-count-sops]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const cloneData = (value) => {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  };

  function generateId(prefix = "item") {
    const randomPart = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
  }

  function createEmptyState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      lastSavedAt: null,
      managerProfile: {
        id: generateId("manager"),
        name: "",
        role: "",
        location: "",
        focusArea: "",
      },
      teamMembers: [],
      roles: [],
      tasks: [],
      meetings: [],
      kpis: [],
      rocks: [],
      issues: [],
      praise: [],
      feedback: [],
      coachingNotes: [],
      trainingItems: [],
      skillRatings: [],
      inductionPlans: [],
      thirtySixtyNinetyPlans: [],
      sops: [],
      improvements: [],
      handovers: [],
      settings: {
        theme: "premium-dark",
        reducedMotion: prefersReducedMotion,
        localFirstMode: true,
        activeView: "today",
      },
      analyticsSnapshots: [],
    };
  }

  function seedSampleData() {
    const state = createEmptyState();

    state.managerProfile = {
      id: generateId("manager"),
      name: "Ava Reynolds",
      role: "Operations Manager",
      location: "Melbourne Service Hub",
      focusArea: "Daily execution rhythm",
    };

    state.teamMembers = [
      {
        id: generateId("member"),
        name: "Mia Chen",
        roleId: "role_service_lead",
        department: "Service",
        managerId: state.managerProfile.id,
        oneOnOneDue: true,
        status: "active",
      },
      {
        id: generateId("member"),
        name: "Noah Patel",
        roleId: "role_install_coordinator",
        department: "Installations",
        managerId: state.managerProfile.id,
        oneOnOneDue: false,
        status: "active",
      },
      {
        id: generateId("member"),
        name: "Sophie Martin",
        roleId: "role_training_lead",
        department: "People Development",
        managerId: state.managerProfile.id,
        oneOnOneDue: true,
        status: "active",
      },
      {
        id: generateId("member"),
        name: "Ethan Brooks",
        roleId: "role_dispatch_supervisor",
        department: "Operations",
        managerId: state.managerProfile.id,
        oneOnOneDue: true,
        status: "active",
      },
    ];

    state.roles = [
      {
        id: "role_service_lead",
        title: "Service Team Lead",
        ownerId: state.teamMembers[0].id,
        accountability: "Own the morning service huddle and escalations.",
        backupOwnerId: state.teamMembers[3].id,
      },
      {
        id: "role_install_coordinator",
        title: "Installation Coordinator",
        ownerId: state.teamMembers[1].id,
        accountability: "Keep installs on time and risk-flagged early.",
        backupOwnerId: state.teamMembers[0].id,
      },
      {
        id: "role_training_lead",
        title: "Training Lead",
        ownerId: state.teamMembers[2].id,
        accountability: "Maintain training rhythm and role readiness.",
        backupOwnerId: state.teamMembers[3].id,
      },
      {
        id: "role_dispatch_supervisor",
        title: "Dispatch Supervisor",
        ownerId: state.teamMembers[3].id,
        accountability: "Own dispatch flow and handover quality.",
        backupOwnerId: state.teamMembers[1].id,
      },
    ];

    state.tasks = [
      {
        id: generateId("task"),
        title: "Close overdue field install defects",
        ownerId: state.teamMembers[1].id,
        status: "in_progress",
        priority: "high",
        dueDate: "2026-07-01",
        linkedMeetingId: "meeting_huddle",
        linkedKpiId: "kpi_first_time_fix",
        linkedIssueId: "issue_install_rework",
      },
      {
        id: generateId("task"),
        title: "Prepare one-on-one follow-up for Mia",
        ownerId: state.managerProfile.id,
        status: "due_today",
        priority: "medium",
        dueDate: "2026-07-01",
        linkedMeetingId: "meeting_1on1_mia",
        linkedKpiId: null,
        linkedIssueId: null,
      },
      {
        id: generateId("task"),
        title: "Review amber training completion report",
        ownerId: state.teamMembers[2].id,
        status: "blocked",
        priority: "medium",
        dueDate: "2026-07-02",
        linkedMeetingId: "meeting_training_review",
        linkedKpiId: "kpi_training_completion",
        linkedIssueId: "issue_induction_gap",
      },
      {
        id: generateId("task"),
        title: "Confirm owner for repeat service callback actions",
        ownerId: state.teamMembers[0].id,
        status: "open",
        priority: "high",
        dueDate: "2026-07-02",
        linkedMeetingId: "meeting_l10",
        linkedKpiId: "kpi_service_callback_rate",
        linkedIssueId: "issue_callback_spike",
      },
    ];

    state.meetings = [
      {
        id: "meeting_huddle",
        title: "Morning Huddle",
        cadence: "daily",
        ownerId: state.teamMembers[0].id,
        scheduledAt: "2026-07-01T08:30:00+10:00",
        type: "huddle",
      },
      {
        id: "meeting_1on1_mia",
        title: "One-on-One: Mia Chen",
        cadence: "weekly",
        ownerId: state.managerProfile.id,
        scheduledAt: "2026-07-01T11:00:00+10:00",
        type: "one_on_one",
      },
      {
        id: "meeting_l10",
        title: "Leadership L10",
        cadence: "weekly",
        ownerId: state.managerProfile.id,
        scheduledAt: "2026-07-02T09:00:00+10:00",
        type: "l10",
      },
      {
        id: "meeting_training_review",
        title: "Training Risk Review",
        cadence: "weekly",
        ownerId: state.teamMembers[2].id,
        scheduledAt: "2026-07-03T14:00:00+10:00",
        type: "review",
      },
    ];

    state.kpis = [
      {
        id: "kpi_first_time_fix",
        name: "First Time Fix",
        target: 92,
        actual: 88,
        status: "amber",
        ownerId: state.teamMembers[0].id,
        trend: "down",
      },
      {
        id: "kpi_training_completion",
        name: "Training Completion",
        target: 100,
        actual: 84,
        status: "red",
        ownerId: state.teamMembers[2].id,
        trend: "flat",
      },
      {
        id: "kpi_service_callback_rate",
        name: "Service Callback Rate",
        target: 3,
        actual: 5,
        status: "red",
        ownerId: state.teamMembers[0].id,
        trend: "up",
      },
      {
        id: generateId("kpi"),
        name: "Handover Completion",
        target: 100,
        actual: 98,
        status: "green",
        ownerId: state.teamMembers[3].id,
        trend: "up",
      },
    ];

    state.rocks = [
      {
        id: generateId("rock"),
        title: "Lift morning huddle discipline across all teams",
        ownerId: state.managerProfile.id,
        quarter: "Q3 2026",
        status: "on_track",
      },
      {
        id: generateId("rock"),
        title: "Reduce repeat callbacks by 20 percent",
        ownerId: state.teamMembers[0].id,
        quarter: "Q3 2026",
        status: "at_risk",
      },
    ];

    state.issues = [
      {
        id: "issue_callback_spike",
        title: "Repeat service callbacks rising in metro zone",
        severity: "high",
        status: "open",
        ownerId: state.teamMembers[0].id,
        source: "KPI review",
      },
      {
        id: "issue_install_rework",
        title: "Installation rework not closed within 48 hours",
        severity: "high",
        status: "open",
        ownerId: state.teamMembers[1].id,
        source: "Morning huddle",
      },
      {
        id: "issue_induction_gap",
        title: "New starter induction checklist incomplete",
        severity: "medium",
        status: "in_progress",
        ownerId: state.teamMembers[2].id,
        source: "Training review",
      },
    ];

    state.praise = [
      {
        id: generateId("praise"),
        memberId: state.teamMembers[0].id,
        note: "Handled a difficult escalation calmly and kept the customer informed.",
        loggedAt: "2026-06-30T16:20:00+10:00",
      },
      {
        id: generateId("praise"),
        memberId: state.teamMembers[3].id,
        note: "Improved dispatch handover clarity for the late shift team.",
        loggedAt: "2026-06-30T17:05:00+10:00",
      },
    ];

    state.feedback = [
      {
        id: generateId("feedback"),
        memberId: state.teamMembers[1].id,
        note: "Tighten owner confirmation before install jobs leave planning.",
        followUpDue: "2026-07-03",
        status: "open",
      },
      {
        id: generateId("feedback"),
        memberId: state.teamMembers[2].id,
        note: "Standardise induction reviews at day 14 and day 30.",
        followUpDue: "2026-07-04",
        status: "open",
      },
    ];

    state.coachingNotes = [
      {
        id: generateId("coaching"),
        memberId: state.teamMembers[0].id,
        topic: "Escalation leadership",
        summary: "Move from reactive updates to clearer ownership at close.",
        nextStep: "Review action close-out next one-on-one.",
      },
      {
        id: generateId("coaching"),
        memberId: state.teamMembers[3].id,
        topic: "Shift handover quality",
        summary: "Introduce a tighter close checklist for dispatch notes.",
        nextStep: "Trial checklist for five days.",
      },
    ];

    state.trainingItems = [
      {
        id: generateId("training"),
        title: "Morning Huddle Facilitation",
        ownerId: state.teamMembers[0].id,
        status: "scheduled",
        dueDate: "2026-07-08",
      },
      {
        id: generateId("training"),
        title: "New Starter Dispatch Induction",
        ownerId: state.teamMembers[2].id,
        status: "at_risk",
        dueDate: "2026-07-05",
      },
    ];

    state.skillRatings = [
      {
        id: generateId("skill"),
        memberId: state.teamMembers[0].id,
        skill: "Coaching",
        rating: 4,
      },
      {
        id: generateId("skill"),
        memberId: state.teamMembers[1].id,
        skill: "Planning Accuracy",
        rating: 3,
      },
      {
        id: generateId("skill"),
        memberId: state.teamMembers[3].id,
        skill: "Handover Discipline",
        rating: 2,
      },
    ];

    state.inductionPlans = [
      {
        id: generateId("induction"),
        memberId: state.teamMembers[3].id,
        stage: "Week 2",
        status: "in_progress",
      },
    ];

    state.thirtySixtyNinetyPlans = [
      {
        id: generateId("plan"),
        memberId: state.teamMembers[1].id,
        milestone: "60-day install planning confidence review",
        status: "on_track",
      },
    ];

    state.sops = [
      {
        id: generateId("sop"),
        title: "Morning Huddle SOP",
        ownerId: state.teamMembers[0].id,
        reviewDate: "2026-07-15",
        status: "current",
      },
      {
        id: generateId("sop"),
        title: "Dispatch Close Handover SOP",
        ownerId: state.teamMembers[3].id,
        reviewDate: "2026-07-04",
        status: "review_due",
      },
      {
        id: generateId("sop"),
        title: "Induction Checklist SOP",
        ownerId: state.teamMembers[2].id,
        reviewDate: "2026-07-10",
        status: "current",
      },
    ];

    state.improvements = [
      {
        id: generateId("improvement"),
        title: "Reduce repeat callbacks by flagging install defects earlier",
        ownerId: state.teamMembers[1].id,
        stage: "experiment",
        impact: "service stability",
      },
      {
        id: generateId("improvement"),
        title: "Standardise end-of-day leadership handover template",
        ownerId: state.teamMembers[3].id,
        stage: "implemented",
        impact: "handover quality",
      },
    ];

    state.handovers = [
      {
        id: generateId("handover"),
        ownerId: state.teamMembers[3].id,
        shiftDate: "2026-06-30",
        summary: "Late dispatch queue cleared with one unresolved install dependency.",
      },
    ];

    state.analyticsSnapshots = [
      {
        id: generateId("snapshot"),
        capturedAt: "2026-06-30T18:00:00+10:00",
        openTasks: 4,
        redKpis: 2,
        openIssues: 3,
      },
    ];

    return state;
  }

  function normaliseState(rawState) {
    const source =
      rawState && typeof rawState === "object" ? cloneData(rawState) : {};
    const defaults = createEmptyState();
    const normalised = {
      ...defaults,
      ...source,
      schemaVersion: SCHEMA_VERSION,
      managerProfile: {
        ...defaults.managerProfile,
        ...(source.managerProfile && typeof source.managerProfile === "object"
          ? source.managerProfile
          : {}),
      },
      settings: {
        ...defaults.settings,
        ...(source.settings && typeof source.settings === "object"
          ? source.settings
          : {}),
      },
    };

    const collectionKeys = [
      "teamMembers",
      "roles",
      "tasks",
      "meetings",
      "kpis",
      "rocks",
      "issues",
      "praise",
      "feedback",
      "coachingNotes",
      "trainingItems",
      "skillRatings",
      "inductionPlans",
      "thirtySixtyNinetyPlans",
      "sops",
      "improvements",
      "handovers",
      "analyticsSnapshots",
    ];

    collectionKeys.forEach((key) => {
      normalised[key] = Array.isArray(source[key]) ? source[key] : defaults[key];
    });

    normalised.lastSavedAt =
      typeof source.lastSavedAt === "string" ? source.lastSavedAt : null;

    return normalised;
  }

  function updateLastSaved(timestamp = appState?.lastSavedAt ?? null) {
    if (!lastSavedNode) {
      return;
    }

    if (!timestamp) {
      lastSavedNode.textContent = "Not yet saved";
      return;
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      lastSavedNode.textContent = "Not yet saved";
      return;
    }

    lastSavedNode.textContent = date.toLocaleString("en-AU", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function showToast(title, message, type = "success") {
    if (!toastStack) {
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " toast--error" : ""}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.innerHTML = `
      <div class="toast__title">${title}</div>
      <div class="toast__body">${message}</div>
    `;

    toastStack.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    const removeToast = () => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.remove();
      }, prefersReducedMotion ? 0 : 260);
    };

    window.setTimeout(removeToast, type === "error" ? 4200 : 2800);
  }

  function isValidImportedState(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      return false;
    }

    const requiredKeys = [
      "managerProfile",
      "teamMembers",
      "roles",
      "tasks",
      "meetings",
      "kpis",
      "rocks",
      "issues",
      "praise",
      "feedback",
      "coachingNotes",
      "trainingItems",
      "skillRatings",
      "inductionPlans",
      "thirtySixtyNinetyPlans",
      "sops",
      "improvements",
      "handovers",
      "settings",
      "analyticsSnapshots",
    ];

    return requiredKeys.every((key) => key in candidate);
  }

  function saveState(nextState = appState, options = {}) {
    const stateToPersist = normaliseState(nextState);
    const persistTimestamp = options.preserveTimestamp
      ? stateToPersist.lastSavedAt
      : new Date().toISOString();

    stateToPersist.lastSavedAt = persistTimestamp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    appState = stateToPersist;
    updateLastSaved(persistTimestamp);
    renderStateSummary();
    return appState;
  }

  function loadState() {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      appState = normaliseState(seedSampleData());
      saveState(appState);
      showToast(
        "Sample data loaded",
        "TalentisOS started with local-first sample data for Phase 2."
      );
      return appState;
    }

    try {
      appState = normaliseState(JSON.parse(storedValue));
      renderStateSummary();
      updateLastSaved(appState.lastSavedAt);
      return appState;
    } catch (_error) {
      appState = normaliseState(seedSampleData());
      saveState(appState);
      showToast(
        "Stored data reset",
        "Saved data could not be read, so sample data was restored.",
        "error"
      );
      return appState;
    }
  }

  function exportData() {
    try {
      const exportState = normaliseState(appState);
      const payload = JSON.stringify(exportState, null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

      link.href = url;
      link.download = `talentisos-state-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("Export ready", "Your TalentisOS data was downloaded as JSON.");
    } catch (_error) {
      showToast("Export failed", "The local export could not be created.", "error");
    }
  }

  function importData(file) {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        const rawText = typeof reader.result === "string" ? reader.result : "";
        const parsed = JSON.parse(rawText);

        if (!isValidImportedState(parsed)) {
          throw new Error("Invalid data shape");
        }

        const importedState = normaliseState(parsed);
        saveState(importedState);
        showToast("Import complete", "Local TalentisOS data was restored.");
      } catch (_error) {
        showToast(
          "Import failed",
          "That file is not a valid TalentisOS JSON export.",
          "error"
        );
      } finally {
        importInput.value = "";
      }
    });

    reader.addEventListener("error", () => {
      importInput.value = "";
      showToast(
        "Import failed",
        "The selected file could not be read locally.",
        "error"
      );
    });

    reader.readAsText(file);
  }

  function resetSampleData() {
    const shouldReset = window.confirm(
      "Reset TalentisOS to the Phase 2 sample data? This will replace your current local data."
    );

    if (!shouldReset) {
      return;
    }

    appState = normaliseState(seedSampleData());
    saveState(appState);
    showToast(
      "Sample data restored",
      "Realistic local-first sample data has been reloaded."
    );
  }

  function clearAllData() {
    const shouldClear = window.confirm(
      "Clear all local TalentisOS data? This cannot be undone unless you import a backup."
    );

    if (!shouldClear) {
      return;
    }

    appState = normaliseState(createEmptyState());
    saveState(appState);
    showToast("Local data cleared", "All saved TalentisOS data was removed.");
  }

  function getStatusCounts() {
    const openTasks = appState.tasks.filter(
      (task) => task.status !== "done" && task.status !== "closed"
    ).length;
    const dueConversations =
      appState.teamMembers.filter((member) => member.oneOnOneDue).length +
      appState.feedback.filter((item) => item.status === "open").length;
    const kpiExceptions = appState.kpis.filter(
      (kpi) => kpi.status === "red" || kpi.status === "amber"
    ).length;
    const openIssues = appState.issues.filter(
      (issue) => issue.status !== "resolved" && issue.status !== "closed"
    ).length;
    const trainingRisk = appState.trainingItems.filter(
      (item) => item.status === "at_risk" || item.status === "blocked"
    ).length;
    const totalSignals =
      openTasks + dueConversations + kpiExceptions + openIssues + trainingRisk;
    const healthScore = Math.max(61, 96 - totalSignals * 4);

    return {
      dueConversations,
      kpiExceptions,
      openIssues,
      trainingRisk,
      openTasks,
      healthScore,
    };
  }

  function renderStateSummary() {
    if (!appState) {
      return;
    }

    const counts = getStatusCounts();

    if (schemaVersionNode) {
      schemaVersionNode.textContent = String(appState.schemaVersion);
    }

    if (healthScoreNode) {
      healthScoreNode.textContent = `Health ${counts.healthScore}`;
    }

    if (peopleDueNode) {
      peopleDueNode.textContent = String(counts.dueConversations);
    }

    if (kpiExceptionsNode) {
      kpiExceptionsNode.textContent = String(counts.kpiExceptions);
    }

    if (openIssuesNode) {
      openIssuesNode.textContent = String(counts.openIssues);
    }

    if (trainingRiskNode) {
      trainingRiskNode.textContent = String(counts.trainingRisk);
    }

    if (countTeamMembersNode) {
      countTeamMembersNode.textContent = String(appState.teamMembers.length);
    }

    if (countOpenTasksNode) {
      countOpenTasksNode.textContent = String(counts.openTasks);
    }

    if (countMeetingsNode) {
      countMeetingsNode.textContent = String(appState.meetings.length);
    }

    if (countKpisNode) {
      countKpisNode.textContent = String(appState.kpis.length);
    }

    if (countIssuesNode) {
      countIssuesNode.textContent = String(appState.issues.length);
    }

    if (countSopsNode) {
      countSopsNode.textContent = String(appState.sops.length);
    }
  }

  loadState();
  renderStateSummary();
  updateLastSaved();

  window.TalentisOS = {
    get appState() {
      return cloneData(appState);
    },
    loadState,
    saveState,
    normaliseState,
    generateId,
    exportData,
    importData,
    resetSampleData,
    clearAllData,
    seedSampleData,
    updateLastSaved,
    showToast,
  };

  if (exportTrigger) {
    exportTrigger.addEventListener("click", exportData);
  }

  if (importTrigger && importInput) {
    importTrigger.addEventListener("click", () => {
      importInput.click();
    });

    importInput.addEventListener("change", (event) => {
      const [file] = event.target.files || [];
      importData(file);
    });
  }

  if (resetSampleTrigger) {
    resetSampleTrigger.addEventListener("click", resetSampleData);
  }

  if (clearDataTrigger) {
    clearDataTrigger.addEventListener("click", clearAllData);
  }

  const setActiveLink = (sectionId) => {
    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateViewportMode = () => {
    const isDesktop = window.innerWidth >= 1024;

    if (desktopNav) {
      desktopNav.style.display = isDesktop ? "flex" : "none";
    }

    if (quickActions) {
      quickActions.style.display = isDesktop ? "flex" : "none";
    }

    if (menuToggle) {
      menuToggle.style.display = isDesktop ? "none" : "inline-flex";
    }
  };

  updateViewportMode();
  window.addEventListener("resize", updateViewportMode);

  if (header) {
    const updateScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
  }

  if (menuToggle && mobileMenu) {
    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      mobileMenu.classList.toggle("is-open", isOpen);
      body.classList.toggle("menu-open", isOpen);
      if (header) {
        header.classList.toggle("is-menu-open", isOpen);
      }
    };

    const closeMenu = (restoreFocus = false) => {
      setMenuState(false);
      if (restoreFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu(false);
      });
    });

    document.addEventListener("click", (event) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) {
        return;
      }

      const clickedInsideMenu = event.target.closest("#mobile-navigation");
      const clickedToggle = event.target.closest(".menu-toggle");

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeMenu(true);
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        closeMenu(false);
      }
    });
  }

  if (sections.length > 0) {
    setActiveLink(sections[0].id);

    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visibleEntries[0]) {
            setActiveLink(visibleEntries[0].target.id);
          }
        },
        {
          threshold: [0.2, 0.45, 0.7],
          rootMargin: "-20% 0px -50% 0px",
        }
      );

      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    }
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }
});
