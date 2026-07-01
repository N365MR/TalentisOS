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
  const todayFocusTitleNode = document.querySelector("[data-today-focus-title]");
  const todayFocusCopyNode = document.querySelector("[data-today-focus-copy]");
  const healthScoreLabelNode = document.querySelector("[data-health-score-label]");
  const healthScoreValueNode = document.querySelector("[data-health-score-value]");
  const topThreeStatusNode = document.querySelector("[data-top-three-status]");
  const topThreeListNode = document.querySelector("[data-top-three-list]");
  const peoplePulseCountNode = document.querySelector("[data-people-pulse-count]");
  const peoplePulseMetaNode = document.querySelector("[data-people-pulse-meta]");
  const kpiExceptionsCountNode = document.querySelector(
    "[data-kpi-exceptions-count]"
  );
  const kpiExceptionsMetaNode = document.querySelector(
    "[data-kpi-exceptions-meta]"
  );
  const criticalAlertsCountNode = document.querySelector(
    "[data-critical-alerts-count]"
  );
  const criticalAlertsMetaNode = document.querySelector(
    "[data-critical-alerts-meta]"
  );
  const meetingsTodayCountNode = document.querySelector(
    "[data-meetings-today-count]"
  );
  const meetingsTodayMetaNode = document.querySelector(
    "[data-meetings-today-meta]"
  );
  const overdueCountNode = document.querySelector("[data-overdue-count]");
  const dueTodayCountNode = document.querySelector("[data-due-today-count]");
  const kpiCardCountNode = document.querySelector("[data-kpi-card-count]");
  const peopleRiskCountNode = document.querySelector("[data-people-risk-count]");
  const praiseGapBadgeNode = document.querySelector("[data-praise-gap-badge]");
  const feedbackFollowupCountNode = document.querySelector(
    "[data-feedback-followup-count]"
  );
  const rocksAtRiskCountNode = document.querySelector("[data-rocks-at-risk-count]");
  const sopReviewsCountNode = document.querySelector("[data-sop-reviews-count]");
  const trainingRisksCountNode = document.querySelector(
    "[data-training-risks-count]"
  );
  const progressFillNode = document.querySelector("[data-progress-fill]");
  const overdueTasksListNode = document.querySelector("[data-overdue-tasks-list]");
  const dueTodayListNode = document.querySelector("[data-due-today-list]");
  const kpiExceptionsListNode = document.querySelector("[data-kpi-exceptions-list]");
  const peoplePulseListNode = document.querySelector("[data-people-pulse-list]");
  const praiseGapContentNode = document.querySelector("[data-praise-gap-content]");
  const feedbackFollowupsListNode = document.querySelector(
    "[data-feedback-followups-list]"
  );
  const rocksAtRiskListNode = document.querySelector("[data-rocks-at-risk-list]");
  const sopReviewsListNode = document.querySelector("[data-sop-reviews-list]");
  const trainingRisksListNode = document.querySelector("[data-training-risks-list]");
  const handoverSummaryNode = document.querySelector("[data-handover-summary]");
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

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDateInput = (value) => {
    if (!value || typeof value !== "string") {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T12:00:00`);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getTodayDate = () => new Date();
  const getTodayKey = () => formatDateKey(getTodayDate());

  const isTaskClosed = (task) =>
    task.status === "done" || task.status === "closed" || task.status === "completed";

  const getPersonNameById = (personId) => {
    if (personId === appState.managerProfile.id) {
      return appState.managerProfile.name || "Manager";
    }

    const member = appState.teamMembers.find((item) => item.id === personId);
    return member ? member.name : "Unassigned";
  };

  const formatDisplayDate = (value) => {
    const date = parseDateInput(value);

    if (!date) {
      return "Date not set";
    }

    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
    });
  };

  const differenceInDays = (leftDate, rightDate) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const left = new Date(
      leftDate.getFullYear(),
      leftDate.getMonth(),
      leftDate.getDate()
    );
    const right = new Date(
      rightDate.getFullYear(),
      rightDate.getMonth(),
      rightDate.getDate()
    );

    return Math.round((left.getTime() - right.getTime()) / millisecondsPerDay);
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
        status: "risk",
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
        followUpDue: "2026-07-02",
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
        reviewDate: "2026-07-02",
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

  function getOverdueTasks() {
    const todayKey = getTodayKey();

    return appState.tasks
      .filter((task) => {
        if (isTaskClosed(task) || !task.dueDate) {
          return false;
        }

        return task.dueDate < todayKey;
      })
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate));
  }

  function getTasksDueToday() {
    const todayKey = getTodayKey();

    return appState.tasks.filter(
      (task) => !isTaskClosed(task) && task.dueDate === todayKey
    );
  }

  function getKpiExceptions() {
    return appState.kpis.filter(
      (kpi) => kpi.status === "red" || kpi.status === "amber"
    );
  }

  function getFeedbackFollowUps() {
    const todayKey = getTodayKey();

    return appState.feedback
      .filter(
        (item) =>
          item.status !== "closed" &&
          item.status !== "done" &&
          item.followUpDue &&
          item.followUpDue <= todayKey
      )
      .sort((left, right) => left.followUpDue.localeCompare(right.followUpDue));
  }

  function getSopReviewsDue() {
    const todayKey = getTodayKey();

    return appState.sops
      .filter(
        (item) =>
          item.reviewDate &&
          (item.reviewDate <= todayKey || item.status === "review_due")
      )
      .sort((left, right) => left.reviewDate.localeCompare(right.reviewDate));
  }

  function getTrainingRisks() {
    const todayKey = getTodayKey();

    return appState.trainingItems.filter(
      (item) =>
        item.status === "at_risk" ||
        item.status === "blocked" ||
        (item.dueDate &&
          item.dueDate <= todayKey &&
          item.status !== "completed" &&
          item.status !== "done")
    );
  }

  function getRocksAtRisk() {
    const atRiskStatuses = new Set(["at_risk", "off_track", "blocked"]);
    return appState.rocks.filter((rock) => atRiskStatuses.has(rock.status));
  }

  function getPraiseGap() {
    if (appState.praise.length === 0) {
      return {
        hasGap: true,
        daysSinceLastPraise: null,
        lastPraiseAt: null,
        summary: "No praise has been logged yet.",
      };
    }

    const latestPraise = appState.praise
      .map((entry) => parseDateInput(entry.loggedAt))
      .filter(Boolean)
      .sort((left, right) => right.getTime() - left.getTime())[0];

    if (!latestPraise) {
      return {
        hasGap: true,
        daysSinceLastPraise: null,
        lastPraiseAt: null,
        summary: "Praise history is missing a valid date.",
      };
    }

    const daysSinceLastPraise = differenceInDays(getTodayDate(), latestPraise);

    return {
      hasGap: daysSinceLastPraise >= 7,
      daysSinceLastPraise,
      lastPraiseAt: latestPraise,
      summary:
        daysSinceLastPraise >= 7
          ? `No praise has been logged in ${daysSinceLastPraise} days.`
          : `Last praise was logged ${daysSinceLastPraise} day${
              daysSinceLastPraise === 1 ? "" : "s"
            } ago.`,
    };
  }

  function getPeoplePulse() {
    const lowSkillMemberIds = new Set(
      appState.skillRatings
        .filter((item) => Number(item.rating) <= 2)
        .map((item) => item.memberId)
    );

    const followUpMemberIds = new Set(
      getFeedbackFollowUps().map((item) => item.memberId)
    );

    return appState.teamMembers.filter(
      (member) =>
        member.status === "risk" ||
        member.status === "at_risk" ||
        member.oneOnOneDue ||
        lowSkillMemberIds.has(member.id) ||
        followUpMemberIds.has(member.id)
    );
  }

  function getMeetingsToday() {
    const todayKey = getTodayKey();

    return appState.meetings
      .filter((meeting) => {
        const scheduledDate = parseDateInput(meeting.scheduledAt);
        return scheduledDate ? formatDateKey(scheduledDate) === todayKey : false;
      })
      .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));
  }

  function getCriticalAlerts(todayItems) {
    const alerts = [];

    if (todayItems.overdueTasks.length > 0) {
      alerts.push(
        `${todayItems.overdueTasks.length} overdue task${
          todayItems.overdueTasks.length === 1 ? "" : "s"
        } need attention`
      );
    }

    const redKpiCount = todayItems.kpiExceptions.filter(
      (item) => item.status === "red"
    ).length;

    if (redKpiCount > 0) {
      alerts.push(`${redKpiCount} red KPI exception${redKpiCount === 1 ? "" : "s"}`);
    }

    if (todayItems.feedbackFollowUps.length > 0) {
      alerts.push(
        `${todayItems.feedbackFollowUps.length} feedback follow-up${
          todayItems.feedbackFollowUps.length === 1 ? "" : "s"
        } due now`
      );
    }

    if (todayItems.trainingRisks.length > 0) {
      alerts.push(
        `${todayItems.trainingRisks.length} training risk${
          todayItems.trainingRisks.length === 1 ? "" : "s"
        } visible`
      );
    }

    if (todayItems.rocksAtRisk.length > 0) {
      alerts.push(
        `${todayItems.rocksAtRisk.length} rock${
          todayItems.rocksAtRisk.length === 1 ? "" : "s"
        } at risk`
      );
    }

    if (todayItems.peoplePulse.filter((member) => member.status === "risk").length > 0) {
      alerts.push("At least one team member is marked as risk");
    }

    return alerts;
  }

  function calculateLeadershipHealthScore(todayItems) {
    const penalties =
      todayItems.overdueTasks.length * 7 +
      todayItems.kpiExceptions.filter((item) => item.status === "red").length * 8 +
      todayItems.kpiExceptions.filter((item) => item.status === "amber").length * 4 +
      todayItems.feedbackFollowUps.length * 5 +
      todayItems.trainingRisks.length * 6 +
      todayItems.rocksAtRisk.length * 6 +
      todayItems.peoplePulse.filter((member) => member.status === "risk").length * 7 +
      todayItems.sopReviewsDue.length * 3;

    const score = Math.max(38, Math.min(98, 100 - penalties));
    let label = "Calm";

    if (score < 60) {
      label = "Urgent";
    } else if (score < 78) {
      label = "Watch";
    }

    return {
      score,
      label,
      progress: score,
    };
  }

  function calculateTodayItems() {
    const overdueTasks = getOverdueTasks();
    const tasksDueToday = getTasksDueToday();
    const kpiExceptions = getKpiExceptions();
    const feedbackFollowUps = getFeedbackFollowUps();
    const sopReviewsDue = getSopReviewsDue();
    const trainingRisks = getTrainingRisks();
    const rocksAtRisk = getRocksAtRisk();
    const praiseGap = getPraiseGap();
    const peoplePulse = getPeoplePulse();
    const meetingsToday = getMeetingsToday();
    const criticalAlerts = getCriticalAlerts({
      overdueTasks,
      kpiExceptions,
      feedbackFollowUps,
      sopReviewsDue,
      trainingRisks,
      rocksAtRisk,
      praiseGap,
      peoplePulse,
      meetingsToday,
    });

    const topThree = [
      overdueTasks[0]
        ? {
            title: overdueTasks[0].title,
            meta: `Overdue since ${formatDisplayDate(overdueTasks[0].dueDate)}`,
          }
        : null,
      kpiExceptions[0]
        ? {
            title: `${kpiExceptions[0].name} needs review`,
            meta: `${kpiExceptions[0].status.toUpperCase()} status with owner ${getPersonNameById(
              kpiExceptions[0].ownerId
            )}`,
          }
        : null,
      feedbackFollowUps[0]
        ? {
            title: `Follow up with ${getPersonNameById(
              feedbackFollowUps[0].memberId
            )}`,
            meta: `Due ${formatDisplayDate(feedbackFollowUps[0].followUpDue)}`,
          }
        : null,
      meetingsToday[0]
        ? {
            title: `Run ${meetingsToday[0].title}`,
            meta: `Scheduled ${parseDateInput(
              meetingsToday[0].scheduledAt
            )?.toLocaleTimeString("en-AU", {
              hour: "numeric",
              minute: "2-digit",
            })}`,
          }
        : null,
      tasksDueToday[0]
        ? {
            title: tasksDueToday[0].title,
            meta: `Due today with ${getPersonNameById(tasksDueToday[0].ownerId)}`,
          }
        : null,
    ]
      .filter(Boolean)
      .slice(0, 3);

    const focus =
      overdueTasks[0] ||
      feedbackFollowUps[0] ||
      kpiExceptions[0] ||
      tasksDueToday[0] ||
      meetingsToday[0] ||
      null;

    const health = calculateLeadershipHealthScore({
      overdueTasks,
      tasksDueToday,
      kpiExceptions,
      feedbackFollowUps,
      sopReviewsDue,
      trainingRisks,
      rocksAtRisk,
      praiseGap,
      peoplePulse,
      meetingsToday,
    });

    return {
      overdueTasks,
      tasksDueToday,
      kpiExceptions,
      feedbackFollowUps,
      sopReviewsDue,
      trainingRisks,
      rocksAtRisk,
      praiseGap,
      peoplePulse,
      meetingsToday,
      criticalAlerts,
      topThree,
      focus,
      health,
    };
  }

  function initCountUp() {
    document.querySelectorAll("[data-count-up]").forEach((node) => {
      const target = Number(node.dataset.targetCount ?? node.textContent ?? "0");
      const safeTarget = Number.isFinite(target) ? target : 0;
      const currentValue = Number(node.dataset.countCurrent ?? "0");

      if (prefersReducedMotion) {
        node.textContent = String(Math.round(safeTarget));
        node.dataset.countCurrent = String(Math.round(safeTarget));
        return;
      }

      const startValue = Number.isFinite(currentValue) ? currentValue : 0;
      const duration = 650;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const nextValue = Math.round(
          startValue + (safeTarget - startValue) * progress
        );
        node.textContent = String(nextValue);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          node.textContent = String(Math.round(safeTarget));
          node.dataset.countCurrent = String(Math.round(safeTarget));
        }
      };

      requestAnimationFrame(step);
    });
  }

  function initProgressBars() {
    document.querySelectorAll("[data-progress-fill]").forEach((node) => {
      const nextValue = Math.max(
        0,
        Math.min(100, Number(node.dataset.progressValue ?? "0"))
      );
      const track = node.parentElement;

      if (track) {
        track.setAttribute("aria-valuenow", String(Math.round(nextValue)));
      }

      if (prefersReducedMotion) {
        node.style.width = `${nextValue}%`;
        return;
      }

      requestAnimationFrame(() => {
        node.style.width = `${nextValue}%`;
      });
    });
  }

  function renderEmptyState(message) {
    return `<div class="dashboard-empty-state">${escapeHtml(message)}</div>`;
  }

  function renderTodayList(items, options) {
    const { emptyMessage, getTitle, getMeta, getEyebrow } = options;

    if (!items.length) {
      return renderEmptyState(emptyMessage);
    }

    return `
      <ul class="today-list">
        ${items
          .map(
            (item) => `
              <li class="today-list__item">
                <p class="today-list__eyebrow">${escapeHtml(getEyebrow(item))}</p>
                <p class="today-list__title">${escapeHtml(getTitle(item))}</p>
                <p class="today-list__meta">${escapeHtml(getMeta(item))}</p>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
  }

  function getStatusCounts() {
    const todayItems = calculateTodayItems();
    const openTasks = appState.tasks.filter((task) => !isTaskClosed(task)).length;
    const dueConversations =
      todayItems.peoplePulse.length + todayItems.feedbackFollowUps.length;
    const openIssues = appState.issues.filter(
      (issue) => issue.status !== "resolved" && issue.status !== "closed"
    ).length;

    return {
      dueConversations,
      kpiExceptions: todayItems.kpiExceptions.length,
      openIssues,
      trainingRisk: todayItems.trainingRisks.length,
      openTasks,
      healthScore: todayItems.health.score,
    };
  }

  function renderTodayDashboard() {
    if (!appState) {
      return;
    }

    const todayItems = calculateTodayItems();
    const latestHandover = appState.handovers
      .slice()
      .sort((left, right) => right.shiftDate.localeCompare(left.shiftDate))[0];

    if (todayFocusTitleNode) {
      todayFocusTitleNode.textContent = todayItems.focus
        ? todayItems.focus.title
        : "The dashboard is calm and ready.";
    }

    if (todayFocusCopyNode) {
      todayFocusCopyNode.textContent = todayItems.focus
        ? "Start here first, then move through the rest of the operating rhythm with visible follow-through."
        : "No urgent items are currently blocking the day. Use the quick actions to review meetings, tasks and KPIs.";
    }

    if (healthScoreLabelNode) {
      healthScoreLabelNode.textContent = `${todayItems.health.label} ${todayItems.health.score}`;
    }

    if (healthScoreValueNode) {
      healthScoreValueNode.dataset.targetCount = String(todayItems.health.score);
    }

    if (progressFillNode) {
      progressFillNode.dataset.progressValue = String(todayItems.health.progress);
    }

    if (topThreeStatusNode) {
      topThreeStatusNode.textContent =
        todayItems.topThree.length > 0 ? "In focus" : "Clear";
    }

    if (topThreeListNode) {
      topThreeListNode.innerHTML = todayItems.topThree.length
        ? todayItems.topThree
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(
                  item.meta
                )}</li>`
            )
            .join("")
        : "<li>The day is clear. Use this space to set your next three priorities.</li>";
    }

    if (peoplePulseCountNode) {
      peoplePulseCountNode.dataset.targetCount = String(todayItems.peoplePulse.length);
    }

    if (peoplePulseMetaNode) {
      peoplePulseMetaNode.textContent =
        todayItems.peoplePulse.length > 0
          ? `${todayItems.peoplePulse.length} people need leader attention today`
          : "No people risks are currently visible";
    }

    if (kpiExceptionsCountNode) {
      kpiExceptionsCountNode.dataset.targetCount = String(
        todayItems.kpiExceptions.length
      );
    }

    if (kpiExceptionsMetaNode) {
      kpiExceptionsMetaNode.textContent =
        todayItems.kpiExceptions.length > 0
          ? "Red and amber indicators surfaced from app state"
          : "All KPIs are currently stable";
    }

    if (criticalAlertsCountNode) {
      criticalAlertsCountNode.dataset.targetCount = String(
        todayItems.criticalAlerts.length
      );
    }

    if (criticalAlertsMetaNode) {
      criticalAlertsMetaNode.textContent =
        todayItems.criticalAlerts[0] || "No critical alerts are active right now";
    }

    if (meetingsTodayCountNode) {
      meetingsTodayCountNode.dataset.targetCount = String(
        todayItems.meetingsToday.length
      );
    }

    if (meetingsTodayMetaNode) {
      meetingsTodayMetaNode.textContent =
        todayItems.meetingsToday.length > 0
          ? `${todayItems.meetingsToday[0].title} is on today's rhythm`
          : "No meetings are scheduled for today";
    }

    if (overdueCountNode) {
      overdueCountNode.textContent = String(todayItems.overdueTasks.length);
    }

    if (dueTodayCountNode) {
      dueTodayCountNode.textContent = String(todayItems.tasksDueToday.length);
    }

    if (kpiCardCountNode) {
      kpiCardCountNode.textContent = String(todayItems.kpiExceptions.length);
    }

    if (peopleRiskCountNode) {
      peopleRiskCountNode.textContent = String(todayItems.peoplePulse.length);
    }

    if (praiseGapBadgeNode) {
      praiseGapBadgeNode.textContent = todayItems.praiseGap.hasGap
        ? "Praise gap"
        : "On rhythm";
    }

    if (feedbackFollowupCountNode) {
      feedbackFollowupCountNode.textContent = String(
        todayItems.feedbackFollowUps.length
      );
    }

    if (rocksAtRiskCountNode) {
      rocksAtRiskCountNode.textContent = String(todayItems.rocksAtRisk.length);
    }

    if (sopReviewsCountNode) {
      sopReviewsCountNode.textContent = String(todayItems.sopReviewsDue.length);
    }

    if (trainingRisksCountNode) {
      trainingRisksCountNode.textContent = String(todayItems.trainingRisks.length);
    }

    if (overdueTasksListNode) {
      overdueTasksListNode.innerHTML = renderTodayList(todayItems.overdueTasks, {
        emptyMessage: "No overdue tasks are currently visible.",
        getEyebrow: (task) => `${task.priority || "normal"} priority`,
        getTitle: (task) => task.title,
        getMeta: (task) =>
          `Owner: ${getPersonNameById(task.ownerId)} • Due ${formatDisplayDate(
            task.dueDate
          )}`,
      });
    }

    if (dueTodayListNode) {
      dueTodayListNode.innerHTML = renderTodayList(todayItems.tasksDueToday, {
        emptyMessage: "No tasks are due today.",
        getEyebrow: (task) => task.status || "open",
        getTitle: (task) => task.title,
        getMeta: (task) =>
          `Owner: ${getPersonNameById(task.ownerId)} • Due ${formatDisplayDate(
            task.dueDate
          )}`,
      });
    }

    if (kpiExceptionsListNode) {
      kpiExceptionsListNode.innerHTML = renderTodayList(todayItems.kpiExceptions, {
        emptyMessage: "No KPI exceptions are currently active.",
        getEyebrow: (kpi) => `${kpi.status} KPI`,
        getTitle: (kpi) => kpi.name,
        getMeta: (kpi) =>
          `Target ${kpi.target} • Actual ${kpi.actual} • Owner ${getPersonNameById(
            kpi.ownerId
          )}`,
      });
    }

    if (peoplePulseListNode) {
      peoplePulseListNode.innerHTML = renderTodayList(todayItems.peoplePulse, {
        emptyMessage: "No people risks or follow-ups are visible right now.",
        getEyebrow: (member) => member.status || "active",
        getTitle: (member) => member.name,
        getMeta: (member) =>
          member.oneOnOneDue
            ? "One-on-one due today or soon"
            : "Flagged by risk status or leadership development signal",
      });
    }

    if (praiseGapContentNode) {
      praiseGapContentNode.innerHTML = todayItems.praiseGap.hasGap
        ? renderEmptyState(
            `${todayItems.praiseGap.summary} Capture a praise moment today to keep recognition visible.`
          )
        : renderEmptyState(
            `${todayItems.praiseGap.summary} Recognition rhythm is staying warm.`
          );
    }

    if (feedbackFollowupsListNode) {
      feedbackFollowupsListNode.innerHTML = renderTodayList(
        todayItems.feedbackFollowUps,
        {
          emptyMessage: "No feedback follow-ups are due today or overdue.",
          getEyebrow: (item) => "Follow-up due",
          getTitle: (item) => getPersonNameById(item.memberId),
          getMeta: (item) =>
            `${item.note} • Due ${formatDisplayDate(item.followUpDue)}`,
        }
      );
    }

    if (rocksAtRiskListNode) {
      rocksAtRiskListNode.innerHTML = renderTodayList(todayItems.rocksAtRisk, {
        emptyMessage: "No rocks are currently marked at risk.",
        getEyebrow: (rock) => rock.status.replaceAll("_", " "),
        getTitle: (rock) => rock.title,
        getMeta: (rock) =>
          `${rock.quarter} • Owner ${getPersonNameById(rock.ownerId)}`,
      });
    }

    if (sopReviewsListNode) {
      sopReviewsListNode.innerHTML = renderTodayList(todayItems.sopReviewsDue, {
        emptyMessage: "No SOP reviews are due today.",
        getEyebrow: (sop) => "Review due",
        getTitle: (sop) => sop.title,
        getMeta: (sop) =>
          `Review ${formatDisplayDate(sop.reviewDate)} • Owner ${getPersonNameById(
            sop.ownerId
          )}`,
      });
    }

    if (trainingRisksListNode) {
      trainingRisksListNode.innerHTML = renderTodayList(todayItems.trainingRisks, {
        emptyMessage: "No training risks are currently active.",
        getEyebrow: (item) => item.status.replaceAll("_", " "),
        getTitle: (item) => item.title,
        getMeta: (item) =>
          `Owner ${getPersonNameById(item.ownerId)} • Due ${formatDisplayDate(
            item.dueDate
          )}`,
      });
    }

    if (handoverSummaryNode) {
      handoverSummaryNode.textContent = latestHandover
        ? `${latestHandover.summary} Last shift date ${formatDisplayDate(
            latestHandover.shiftDate
          )}.`
        : "No handover has been logged yet. Use Daily Close to prepare the next shift clearly.";
    }

    initCountUp();
    initProgressBars();
  }

  function renderStateSummary() {
    if (!appState) {
      return;
    }

    const counts = getStatusCounts();
    renderTodayDashboard();

    if (schemaVersionNode) {
      schemaVersionNode.textContent = String(appState.schemaVersion);
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
    calculateTodayItems,
    calculateLeadershipHealthScore,
    getOverdueTasks,
    getTasksDueToday,
    getKpiExceptions,
    getFeedbackFollowUps,
    getSopReviewsDue,
    getTrainingRisks,
    getRocksAtRisk,
    getPraiseGap,
    initCountUp,
    initProgressBars,
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
