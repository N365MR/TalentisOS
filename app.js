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
  const peopleFocusTitleNode = document.querySelector("[data-people-focus-title]");
  const peopleFocusCopyNode = document.querySelector("[data-people-focus-copy]");
  const peopleOneOnOnesCountNode = document.querySelector(
    "[data-people-one-on-ones-count]"
  );
  const peoplePerformanceRiskCountNode = document.querySelector(
    "[data-people-performance-risk-count]"
  );
  const peopleEngagementRiskCountNode = document.querySelector(
    "[data-people-engagement-risk-count]"
  );
  const peopleMissingRoleCountNode = document.querySelector(
    "[data-people-missing-role-count]"
  );
  const peopleCardListNode = document.querySelector("[data-people-card-list]");
  const personProfileNameNode = document.querySelector("[data-person-profile-name]");
  const personProfileNode = document.querySelector("[data-person-profile]");
  const personFormNode = document.querySelector("[data-person-form]");
  const personFormTitleNode = document.querySelector("[data-person-form-title]");
  const personRoleSelectNode = document.querySelector("[data-role-select]");
  const roleAlertOwnerCountNode = document.querySelector(
    "[data-role-alert-owner-count]"
  );
  const roleAlertOwnerCopyNode = document.querySelector(
    "[data-role-alert-owner-copy]"
  );
  const roleAlertCoverageCountNode = document.querySelector(
    "[data-role-alert-coverage-count]"
  );
  const roleAlertCoverageCopyNode = document.querySelector(
    "[data-role-alert-coverage-copy]"
  );
  const roleAlertClarityCountNode = document.querySelector(
    "[data-role-alert-clarity-count]"
  );
  const roleAlertClarityCopyNode = document.querySelector(
    "[data-role-alert-clarity-copy]"
  );
  const roleCardListNode = document.querySelector("[data-role-card-list]");
  const roleProfileNameNode = document.querySelector("[data-role-profile-name]");
  const roleProfileNode = document.querySelector("[data-role-profile]");
  const roleFormNode = document.querySelector("[data-role-form]");
  const roleFormTitleNode = document.querySelector("[data-role-form-title]");
  const roleOwnerSelectNode = document.querySelector("[data-person-select]");
  const roleBackupSelectNode = document.querySelector("[data-backup-select]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  let selectedPersonId = null;
  let selectedRoleId = null;

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

  const getRoleById = (roleId) =>
    appState.roles.find((role) => role.id === roleId) || null;

  const getRoleTitleById = (roleId) => {
    const role = getRoleById(roleId);
    return role ? role.title : "No linked role";
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

  const parseTextList = (value) =>
    String(value || "")
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);

  const formatListText = (items) =>
    Array.isArray(items) && items.length > 0 ? items.join("\n") : "";

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

  function createDefaultPerson(person = {}) {
    return {
      id: person.id || generateId("member"),
      name: person.name || "",
      roleId: person.roleId || "",
      department: person.department || "",
      managerId: person.managerId || "",
      startDate: person.startDate || "",
      strengths: Array.isArray(person.strengths) ? person.strengths : [],
      developmentAreas: Array.isArray(person.developmentAreas)
        ? person.developmentAreas
        : [],
      pulseStatus: person.pulseStatus || person.status || "steady",
      performanceRisk: person.performanceRisk || "low",
      engagementSignal: person.engagementSignal || "healthy",
      lastOneOnOne: person.lastOneOnOne || "",
      nextOneOnOne: person.nextOneOnOne || "",
      oneOnOneDue:
        typeof person.oneOnOneDue === "boolean" ? person.oneOnOneDue : false,
      status: person.status || person.pulseStatus || "active",
    };
  }

  function createDefaultRole(role = {}) {
    return {
      id: role.id || generateId("role"),
      title: role.title || "",
      purpose: role.purpose || "",
      ownerId: role.ownerId || "",
      backupOwnerId: role.backupOwnerId || "",
      accountability: role.accountability || "",
      accountabilities: Array.isArray(role.accountabilities)
        ? role.accountabilities
        : role.accountability
          ? [role.accountability]
          : [],
      kpiIds: Array.isArray(role.kpiIds) ? role.kpiIds : [],
      sopIds: Array.isArray(role.sopIds) ? role.sopIds : [],
      decisionRights: Array.isArray(role.decisionRights) ? role.decisionRights : [],
      escalationPoints: Array.isArray(role.escalationPoints)
        ? role.escalationPoints
        : [],
      trainingRequired: Array.isArray(role.trainingRequired)
        ? role.trainingRequired
        : [],
    };
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
      createDefaultPerson({
        name: "Mia Chen",
        roleId: "role_service_lead",
        department: "Service",
        managerId: state.managerProfile.id,
        startDate: "2025-09-01",
        strengths: ["Escalation ownership", "Customer calm under pressure"],
        developmentAreas: ["Delegation consistency", "Coaching follow-through"],
        pulseStatus: "steady",
        performanceRisk: "medium",
        engagementSignal: "healthy",
        lastOneOnOne: "2026-06-24",
        nextOneOnOne: "2026-07-02",
        oneOnOneDue: true,
        status: "active",
      }),
      createDefaultPerson({
        name: "Noah Patel",
        roleId: "role_install_coordinator",
        department: "Installations",
        managerId: state.managerProfile.id,
        startDate: "2026-02-10",
        strengths: ["Planning detail", "Cross-team coordination"],
        developmentAreas: ["Owner confirmation discipline"],
        pulseStatus: "watch",
        performanceRisk: "medium",
        engagementSignal: "watch",
        lastOneOnOne: "2026-06-26",
        nextOneOnOne: "2026-07-04",
        oneOnOneDue: false,
        status: "active",
      }),
      createDefaultPerson({
        name: "Sophie Martin",
        roleId: "role_training_lead",
        department: "People Development",
        managerId: state.managerProfile.id,
        startDate: "2025-11-18",
        strengths: ["Training design", "Leader enablement"],
        developmentAreas: ["Earlier risk escalation"],
        pulseStatus: "watch",
        performanceRisk: "low",
        engagementSignal: "healthy",
        lastOneOnOne: "2026-06-20",
        nextOneOnOne: "2026-07-02",
        oneOnOneDue: true,
        status: "active",
      }),
      createDefaultPerson({
        name: "Ethan Brooks",
        roleId: "role_dispatch_supervisor",
        department: "Operations",
        managerId: state.managerProfile.id,
        startDate: "2025-06-03",
        strengths: ["Dispatch judgement", "Late shift coordination"],
        developmentAreas: ["Handover discipline", "Escalation timing"],
        pulseStatus: "risk",
        performanceRisk: "high",
        engagementSignal: "low",
        lastOneOnOne: "2026-06-18",
        nextOneOnOne: "2026-07-02",
        oneOnOneDue: true,
        status: "risk",
      }),
    ];

    state.roles = [
      createDefaultRole({
        id: "role_service_lead",
        title: "Service Team Lead",
        ownerId: state.teamMembers[0].id,
        purpose: "Lead the service team rhythm, escalations and same-day execution.",
        accountabilities: [
          "Own the morning service huddle and escalations",
          "Review callback exceptions before midday",
          "Coordinate same-day customer risk decisions",
        ],
        backupOwnerId: state.teamMembers[3].id,
        kpiIds: ["kpi_first_time_fix", "kpi_service_callback_rate"],
        sopIds: ["Morning Huddle SOP"],
        decisionRights: ["Prioritise service escalations", "Reallocate field coverage"],
        escalationPoints: ["Operations Manager", "Dispatch Supervisor"],
        trainingRequired: ["Coaching Essentials", "Escalation Workflow"],
      }),
      createDefaultRole({
        id: "role_install_coordinator",
        title: "Installation Coordinator",
        ownerId: state.teamMembers[1].id,
        purpose: "Keep install delivery clear, on time and risk-flagged early.",
        accountabilities: [
          "Track install readiness and blockers",
          "Confirm owners before jobs leave planning",
        ],
        backupOwnerId: state.teamMembers[0].id,
        kpiIds: [],
        sopIds: [],
        decisionRights: ["Escalate install blockers", "Re-sequence install queue"],
        escalationPoints: ["Service Team Lead", "Operations Manager"],
        trainingRequired: ["Planning Accuracy Review"],
      }),
      createDefaultRole({
        id: "role_training_lead",
        title: "Training Lead",
        ownerId: state.teamMembers[2].id,
        purpose: "Maintain role readiness, training cadence and onboarding discipline.",
        accountabilities: [
          "Own training completion visibility",
          "Maintain induction and development reviews",
        ],
        backupOwnerId: state.teamMembers[3].id,
        kpiIds: ["kpi_training_completion"],
        sopIds: ["Induction Checklist SOP"],
        decisionRights: ["Pause sign-off when readiness is low"],
        escalationPoints: ["Operations Manager"],
        trainingRequired: ["Training 360 Administration"],
      }),
      createDefaultRole({
        id: "role_dispatch_supervisor",
        title: "Dispatch Supervisor",
        ownerId: state.teamMembers[3].id,
        purpose: "Own dispatch flow, end-of-day handover quality and field coordination.",
        accountabilities: [
          "Maintain dispatch flow",
          "Own close handover quality",
          "Surface shift coverage risks early",
        ],
        backupOwnerId: state.teamMembers[1].id,
        kpiIds: [],
        sopIds: ["Dispatch Close Handover SOP"],
        decisionRights: ["Reassign late field capacity"],
        escalationPoints: ["Operations Manager", "Service Team Lead"],
        trainingRequired: ["Handover Discipline"],
      }),
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

    normalised.teamMembers = normalised.teamMembers.map((member) =>
      createDefaultPerson(member)
    );
    normalised.roles = normalised.roles.map((role) => createDefaultRole(role));

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

  function getResolvedRoleLinks(role) {
    const matchedKpis = appState.kpis.filter(
      (kpi) =>
        role.kpiIds.includes(kpi.id) ||
        role.kpiIds.includes(kpi.name) ||
        kpi.ownerId === role.ownerId
    );
    const matchedSops = appState.sops.filter(
      (sop) =>
        role.sopIds.includes(sop.id) ||
        role.sopIds.includes(sop.title) ||
        sop.ownerId === role.ownerId
    );

    return { matchedKpis, matchedSops };
  }

  function getRoleClarityAlerts(role) {
    const alerts = [];
    const ownerExists =
      role.ownerId && appState.teamMembers.some((person) => person.id === role.ownerId);
    const backupExists =
      role.backupOwnerId &&
      appState.teamMembers.some((person) => person.id === role.backupOwnerId);
    const { matchedKpis, matchedSops } = getResolvedRoleLinks(role);
    const hasPurpose = Boolean(role.purpose && role.purpose.trim());
    const hasAccountabilities = role.accountabilities.length > 0;

    if (!ownerExists) {
      alerts.push("Missing owner");
    }

    if (!backupExists) {
      alerts.push("Missing backup");
    }

    if (matchedKpis.length === 0) {
      alerts.push("Missing KPI");
    }

    if (matchedSops.length === 0) {
      alerts.push("Missing SOP");
    }

    if (!backupExists || role.ownerId === role.backupOwnerId) {
      alerts.push("Single point of failure");
    }

    if (!hasPurpose || !hasAccountabilities) {
      alerts.push("Role ambiguity");
    }

    return alerts;
  }

  function getPeopleSummary() {
    return {
      oneOnOnesDue: appState.teamMembers.filter((person) => person.oneOnOneDue).length,
      performanceRisk: appState.teamMembers.filter(
        (person) => person.performanceRisk === "high"
      ).length,
      engagementRisk: appState.teamMembers.filter(
        (person) => person.engagementSignal === "low"
      ).length,
      missingRole: appState.teamMembers.filter((person) => !getRoleById(person.roleId))
        .length,
    };
  }

  function getRoleAlertSummary() {
    const alerts = appState.roles.flatMap((role) =>
      getRoleClarityAlerts(role).map((alert) => ({ roleId: role.id, alert }))
    );

    return {
      owner: alerts.filter(
        (item) => item.alert === "Missing owner" || item.alert === "Missing backup"
      ).length,
      coverage: alerts.filter((item) => item.alert === "Single point of failure")
        .length,
      clarity: alerts.filter(
        (item) =>
          item.alert === "Missing KPI" ||
          item.alert === "Missing SOP" ||
          item.alert === "Role ambiguity"
      ).length,
    };
  }

  function ensureSelections() {
    if (!selectedPersonId || !appState.teamMembers.some((item) => item.id === selectedPersonId)) {
      selectedPersonId = appState.teamMembers[0]?.id || null;
    }

    if (!selectedRoleId || !appState.roles.some((item) => item.id === selectedRoleId)) {
      selectedRoleId = appState.roles[0]?.id || null;
    }
  }

  function populatePersonRoleOptions(selectedRoleIdValue = "") {
    if (!personRoleSelectNode) {
      return;
    }

    personRoleSelectNode.innerHTML = `
      <option value="">No linked role</option>
      ${appState.roles
        .map(
          (role) => `
            <option value="${escapeHtml(role.id)}" ${
              role.id === selectedRoleIdValue ? "selected" : ""
            }>
              ${escapeHtml(role.title)}
            </option>
          `
        )
        .join("")}
    `;
  }

  function populateRolePersonOptions(ownerId = "", backupId = "") {
    const optionsMarkup = appState.teamMembers
      .map(
        (person) => `
          <option value="${escapeHtml(person.id)}">${escapeHtml(person.name)}</option>
        `
      )
      .join("");

    if (roleOwnerSelectNode) {
      roleOwnerSelectNode.innerHTML = `<option value="">Unassigned</option>${optionsMarkup}`;
      roleOwnerSelectNode.value = ownerId;
    }

    if (roleBackupSelectNode) {
      roleBackupSelectNode.innerHTML = `<option value="">No backup</option>${optionsMarkup}`;
      roleBackupSelectNode.value = backupId;
    }
  }

  function openPersonForm(mode = "new") {
    if (!personFormNode) {
      return;
    }

    const selectedPerson =
      mode === "edit"
        ? appState.teamMembers.find((person) => person.id === selectedPersonId)
        : null;

    personFormNode.classList.add("is-open");
    personFormTitleNode.textContent = selectedPerson ? "Edit person" : "Add person";
    personFormNode.elements.personId.value = selectedPerson?.id || "";
    personFormNode.elements.name.value = selectedPerson?.name || "";
    personFormNode.elements.department.value = selectedPerson?.department || "";
    personFormNode.elements.startDate.value = selectedPerson?.startDate || "";
    personFormNode.elements.pulseStatus.value = selectedPerson?.pulseStatus || "steady";
    personFormNode.elements.performanceRisk.value =
      selectedPerson?.performanceRisk || "low";
    personFormNode.elements.engagementSignal.value =
      selectedPerson?.engagementSignal || "healthy";
    personFormNode.elements.lastOneOnOne.value = selectedPerson?.lastOneOnOne || "";
    personFormNode.elements.nextOneOnOne.value = selectedPerson?.nextOneOnOne || "";
    personFormNode.elements.strengths.value = formatListText(selectedPerson?.strengths);
    personFormNode.elements.developmentAreas.value = formatListText(
      selectedPerson?.developmentAreas
    );
    populatePersonRoleOptions(selectedPerson?.roleId || "");
  }

  function closePersonForm() {
    personFormNode?.classList.remove("is-open");
    if (personFormNode) {
      personFormNode.reset();
      personFormNode.elements.personId.value = "";
    }
  }

  function openRoleForm(mode = "new") {
    if (!roleFormNode) {
      return;
    }

    const selectedRole =
      mode === "edit"
        ? appState.roles.find((role) => role.id === selectedRoleId)
        : null;

    roleFormNode.classList.add("is-open");
    roleFormTitleNode.textContent = selectedRole ? "Edit role" : "Add role";
    roleFormNode.elements.roleId.value = selectedRole?.id || "";
    roleFormNode.elements.title.value = selectedRole?.title || "";
    roleFormNode.elements.purpose.value = selectedRole?.purpose || "";
    roleFormNode.elements.accountabilities.value = formatListText(
      selectedRole?.accountabilities
    );
    roleFormNode.elements.kpiIds.value = formatListText(selectedRole?.kpiIds);
    roleFormNode.elements.sopIds.value = formatListText(selectedRole?.sopIds);
    roleFormNode.elements.decisionRights.value = formatListText(
      selectedRole?.decisionRights
    );
    roleFormNode.elements.escalationPoints.value = formatListText(
      selectedRole?.escalationPoints
    );
    roleFormNode.elements.trainingRequired.value = formatListText(
      selectedRole?.trainingRequired
    );
    populateRolePersonOptions(selectedRole?.ownerId || "", selectedRole?.backupOwnerId || "");
  }

  function closeRoleForm() {
    roleFormNode?.classList.remove("is-open");
    if (roleFormNode) {
      roleFormNode.reset();
      roleFormNode.elements.roleId.value = "";
    }
  }

  function savePersonFromForm(form) {
    const personId = form.elements.personId.value || generateId("member");
    const roleId = form.elements.roleId.value;
    const nextPerson = createDefaultPerson({
      id: personId,
      name: form.elements.name.value.trim(),
      roleId,
      department: form.elements.department.value.trim(),
      managerId: appState.managerProfile.id,
      startDate: form.elements.startDate.value,
      strengths: parseTextList(form.elements.strengths.value),
      developmentAreas: parseTextList(form.elements.developmentAreas.value),
      pulseStatus: form.elements.pulseStatus.value,
      performanceRisk: form.elements.performanceRisk.value,
      engagementSignal: form.elements.engagementSignal.value,
      lastOneOnOne: form.elements.lastOneOnOne.value,
      nextOneOnOne: form.elements.nextOneOnOne.value,
      oneOnOneDue:
        Boolean(form.elements.nextOneOnOne.value) &&
        form.elements.nextOneOnOne.value <= getTodayKey(),
      status:
        form.elements.pulseStatus.value === "risk"
          ? "risk"
          : form.elements.pulseStatus.value === "watch"
            ? "active"
            : "active",
    });

    const existingIndex = appState.teamMembers.findIndex(
      (person) => person.id === personId
    );

    if (existingIndex >= 0) {
      appState.teamMembers.splice(existingIndex, 1, nextPerson);
    } else {
      appState.teamMembers.push(nextPerson);
    }

    selectedPersonId = nextPerson.id;
    saveState(appState);
    closePersonForm();
    showToast("Person saved", `${nextPerson.name} was saved locally.`);
  }

  function saveRoleFromForm(form) {
    const roleId = form.elements.roleId.value || generateId("role");
    const nextRole = createDefaultRole({
      id: roleId,
      title: form.elements.title.value.trim(),
      purpose: form.elements.purpose.value.trim(),
      ownerId: form.elements.ownerId.value,
      backupOwnerId: form.elements.backupOwnerId.value,
      accountabilities: parseTextList(form.elements.accountabilities.value),
      kpiIds: parseTextList(form.elements.kpiIds.value),
      sopIds: parseTextList(form.elements.sopIds.value),
      decisionRights: parseTextList(form.elements.decisionRights.value),
      escalationPoints: parseTextList(form.elements.escalationPoints.value),
      trainingRequired: parseTextList(form.elements.trainingRequired.value),
    });

    const existingIndex = appState.roles.findIndex((role) => role.id === roleId);

    if (existingIndex >= 0) {
      appState.roles.splice(existingIndex, 1, nextRole);
    } else {
      appState.roles.push(nextRole);
    }

    selectedRoleId = nextRole.id;
    saveState(appState);
    closeRoleForm();
    showToast("Role saved", `${nextRole.title} was saved locally.`);
  }

  function deleteSelectedPerson() {
    const person = appState.teamMembers.find((item) => item.id === selectedPersonId);

    if (!person) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${person.name} from TalentisOS? Linked role ownership will be cleared.`
    );

    if (!shouldDelete) {
      return;
    }

    appState.roles = appState.roles.map((role) => ({
      ...role,
      ownerId: role.ownerId === person.id ? "" : role.ownerId,
      backupOwnerId: role.backupOwnerId === person.id ? "" : role.backupOwnerId,
    }));
    appState.teamMembers = appState.teamMembers.filter((item) => item.id !== person.id);
    selectedPersonId = null;
    saveState(appState);
    closePersonForm();
    showToast("Person deleted", `${person.name} was removed locally.`);
  }

  function deleteSelectedRole() {
    const role = appState.roles.find((item) => item.id === selectedRoleId);

    if (!role) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete the role ${role.title}? Linked people will keep their profile but lose the role link.`
    );

    if (!shouldDelete) {
      return;
    }

    appState.teamMembers = appState.teamMembers.map((person) => ({
      ...person,
      roleId: person.roleId === role.id ? "" : person.roleId,
    }));
    appState.roles = appState.roles.filter((item) => item.id !== role.id);
    selectedRoleId = null;
    saveState(appState);
    closeRoleForm();
    showToast("Role deleted", `${role.title} was removed locally.`);
  }

  function renderPersonProfile(person) {
    if (!person) {
      return renderEmptyState("Select a person to view their linked role and accountability profile.");
    }

    const linkedRole = getRoleById(person.roleId);
    const roleAlerts = linkedRole ? getRoleClarityAlerts(linkedRole) : ["Missing role link"];

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(person.department || "No department")}</span>
          <span class="tag-pill">${escapeHtml(getRoleTitleById(person.roleId))}</span>
          <span class="tag-pill">${escapeHtml(person.pulseStatus)}</span>
        </div>
        <div class="management-stat-grid">
          <div class="management-stat">
            <p class="management-stat__label">Start date</p>
            <p class="management-stat__value">${escapeHtml(
              person.startDate ? formatDisplayDate(person.startDate) : "Not set"
            )}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Next one-on-one</p>
            <p class="management-stat__value">${escapeHtml(
              person.nextOneOnOne
                ? formatDisplayDate(person.nextOneOnOne)
                : "Not scheduled"
            )}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Performance risk</p>
            <p class="management-stat__value">${escapeHtml(person.performanceRisk)}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Engagement signal</p>
            <p class="management-stat__value">${escapeHtml(person.engagementSignal)}</p>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Strengths</h4>
          ${
            person.strengths.length > 0
              ? `<ul class="management-profile__list">${person.strengths
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No strengths captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Development areas</h4>
          ${
            person.developmentAreas.length > 0
              ? `<ul class="management-profile__list">${person.developmentAreas
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No development areas captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Linked role and accountability</h4>
          ${
            linkedRole
              ? `
                <p class="management-profile__copy">${escapeHtml(
                  linkedRole.purpose || "Role purpose still needs definition."
                )}</p>
                <ul class="management-profile__list">
                  ${linkedRole.accountabilities
                    .map((item) => `<li>${escapeHtml(item)}</li>`)
                    .join("")}
                </ul>
              `
              : `<p class="management-profile__copy">This person is not linked to a role yet.</p>`
          }
        </div>
        <div class="alert-pill-row">
          ${roleAlerts.map((alert) => `<span class="alert-pill">${escapeHtml(alert)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function renderRoleProfile(role) {
    if (!role) {
      return renderEmptyState("Select a role to view ownership, accountabilities and clarity alerts.");
    }

    const alerts = getRoleClarityAlerts(role);
    const { matchedKpis, matchedSops } = getResolvedRoleLinks(role);

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(getPersonNameById(role.ownerId))}</span>
          <span class="tag-pill">${escapeHtml(
            role.backupOwnerId ? getPersonNameById(role.backupOwnerId) : "No backup"
          )}</span>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Role purpose</h4>
          <p class="management-profile__copy">${escapeHtml(
            role.purpose || "Role purpose still needs definition."
          )}</p>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Accountabilities</h4>
          ${
            role.accountabilities.length > 0
              ? `<ul class="management-profile__list">${role.accountabilities
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No accountabilities captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Linked execution</h4>
          <p class="management-profile__copy">
            KPIs: ${escapeHtml(
              matchedKpis.length > 0
                ? matchedKpis.map((item) => item.name).join(", ")
                : "None linked"
            )}
          </p>
          <p class="management-profile__copy">
            SOPs: ${escapeHtml(
              matchedSops.length > 0
                ? matchedSops.map((item) => item.title).join(", ")
                : "None linked"
            )}
          </p>
          <p class="management-profile__copy">
            Decision rights: ${escapeHtml(
              role.decisionRights.length > 0
                ? role.decisionRights.join(", ")
                : "Not defined"
            )}
          </p>
          <p class="management-profile__copy">
            Escalation points: ${escapeHtml(
              role.escalationPoints.length > 0
                ? role.escalationPoints.join(", ")
                : "Not defined"
            )}
          </p>
          <p class="management-profile__copy">
            Training required: ${escapeHtml(
              role.trainingRequired.length > 0
                ? role.trainingRequired.join(", ")
                : "Not defined"
            )}
          </p>
        </div>
        <div class="alert-pill-row">
          ${alerts.length > 0
            ? alerts.map((alert) => `<span class="alert-pill">${escapeHtml(alert)}</span>`).join("")
            : `<span class="tag-pill">Role clarity strong</span>`}
        </div>
      </div>
    `;
  }

  function renderPeopleAndRoles() {
    ensureSelections();
    const peopleSummary = getPeopleSummary();
    const roleAlertSummary = getRoleAlertSummary();
    const selectedPerson =
      appState.teamMembers.find((item) => item.id === selectedPersonId) || null;
    const selectedRole = appState.roles.find((item) => item.id === selectedRoleId) || null;
    populatePersonRoleOptions(selectedPerson?.roleId || "");
    populateRolePersonOptions(selectedRole?.ownerId || "", selectedRole?.backupOwnerId || "");

    if (peopleFocusTitleNode) {
      peopleFocusTitleNode.textContent =
        selectedPerson?.name || "People focus ready";
    }

    if (peopleFocusCopyNode) {
      peopleFocusCopyNode.textContent = selectedPerson
        ? `${selectedPerson.name} is linked to ${getRoleTitleById(
            selectedPerson.roleId
          )} and carries ${selectedPerson.pulseStatus} pulse status.`
        : "Select a person to see their linked role and leadership context.";
    }

    if (peopleOneOnOnesCountNode) {
      peopleOneOnOnesCountNode.textContent = String(peopleSummary.oneOnOnesDue);
    }

    if (peoplePerformanceRiskCountNode) {
      peoplePerformanceRiskCountNode.textContent = String(
        peopleSummary.performanceRisk
      );
    }

    if (peopleEngagementRiskCountNode) {
      peopleEngagementRiskCountNode.textContent = String(
        peopleSummary.engagementRisk
      );
    }

    if (peopleMissingRoleCountNode) {
      peopleMissingRoleCountNode.textContent = String(peopleSummary.missingRole);
    }

    if (peopleCardListNode) {
      peopleCardListNode.innerHTML =
        appState.teamMembers.length > 0
          ? appState.teamMembers
              .map(
                (person) => `
                  <button
                    type="button"
                    class="management-card ${person.id === selectedPersonId ? "is-selected" : ""}"
                    data-select-person="${escapeHtml(person.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      person.department || "No department"
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(person.name)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      getRoleTitleById(person.roleId)
                    )}</p>
                    <div class="management-tags">
                      <span class="tag-pill">${escapeHtml(person.pulseStatus)}</span>
                      <span class="tag-pill">${escapeHtml(
                        person.nextOneOnOne
                          ? `1:1 ${formatDisplayDate(person.nextOneOnOne)}`
                          : "1:1 not set"
                      )}</span>
                    </div>
                  </button>
                `
              )
              .join("")
          : renderEmptyState("No people profiles exist yet. Add the first person to start building leadership visibility.");
    }

    if (personProfileNameNode) {
      personProfileNameNode.textContent = selectedPerson
        ? selectedPerson.name
        : "Select a person";
    }

    if (personProfileNode) {
      personProfileNode.innerHTML = renderPersonProfile(selectedPerson);
    }

    if (roleAlertOwnerCountNode) {
      roleAlertOwnerCountNode.textContent = String(roleAlertSummary.owner);
    }

    if (roleAlertOwnerCopyNode) {
      roleAlertOwnerCopyNode.textContent =
        roleAlertSummary.owner > 0
          ? `${roleAlertSummary.owner} ownership alert${
              roleAlertSummary.owner === 1 ? "" : "s"
            } are active.`
          : "Every role currently has owner and backup coverage defined.";
    }

    if (roleAlertCoverageCountNode) {
      roleAlertCoverageCountNode.textContent = String(roleAlertSummary.coverage);
    }

    if (roleAlertCoverageCopyNode) {
      roleAlertCoverageCopyNode.textContent =
        roleAlertSummary.coverage > 0
          ? `${roleAlertSummary.coverage} single-point-of-failure risk${
              roleAlertSummary.coverage === 1 ? "" : "s"
            } need attention.`
          : "No single points of failure are currently visible.";
    }

    if (roleAlertClarityCountNode) {
      roleAlertClarityCountNode.textContent = String(roleAlertSummary.clarity);
    }

    if (roleAlertClarityCopyNode) {
      roleAlertClarityCopyNode.textContent =
        roleAlertSummary.clarity > 0
          ? `${roleAlertSummary.clarity} role clarity alert${
              roleAlertSummary.clarity === 1 ? "" : "s"
            } are active.`
          : "KPIs, SOPs and purpose are currently linked well across roles.";
    }

    if (roleCardListNode) {
      roleCardListNode.innerHTML =
        appState.roles.length > 0
          ? appState.roles
              .map((role) => {
                const alerts = getRoleClarityAlerts(role);
                return `
                  <button
                    type="button"
                    class="management-card ${role.id === selectedRoleId ? "is-selected" : ""}"
                    data-select-role="${escapeHtml(role.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      getPersonNameById(role.ownerId)
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(role.title)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      role.purpose || "Role purpose still needs definition."
                    )}</p>
                    <div class="management-tags">
                      ${
                        alerts.length > 0
                          ? alerts
                              .slice(0, 2)
                              .map(
                                (alert) =>
                                  `<span class="alert-pill">${escapeHtml(alert)}</span>`
                              )
                              .join("")
                          : `<span class="tag-pill">Clear ownership</span>`
                      }
                    </div>
                  </button>
                `;
              })
              .join("")
          : renderEmptyState("No roles exist yet. Add the first role to map ownership and accountabilities.");
    }

    if (roleProfileNameNode) {
      roleProfileNameNode.textContent = selectedRole ? selectedRole.title : "Select a role";
    }

    if (roleProfileNode) {
      roleProfileNode.innerHTML = renderRoleProfile(selectedRole);
    }
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
    renderPeopleAndRoles();

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
    renderPeopleAndRoles,
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

  if (peopleCardListNode) {
    peopleCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-person]");

      if (!trigger) {
        return;
      }

      selectedPersonId = trigger.getAttribute("data-select-person");
      renderStateSummary();
    });
  }

  if (roleCardListNode) {
    roleCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-role]");

      if (!trigger) {
        return;
      }

      selectedRoleId = trigger.getAttribute("data-select-role");
      renderStateSummary();
    });
  }

  document.addEventListener("click", (event) => {
    const personActionTrigger = event.target.closest("[data-person-action]");

    if (personActionTrigger) {
      const action = personActionTrigger.getAttribute("data-person-action");

      if (action === "new") {
        openPersonForm("new");
      } else if (action === "edit" && selectedPersonId) {
        openPersonForm("edit");
      } else if (action === "delete" && selectedPersonId) {
        deleteSelectedPerson();
      } else if (action === "cancel") {
        closePersonForm();
      }
    }

    const roleActionTrigger = event.target.closest("[data-role-action]");

    if (roleActionTrigger) {
      const action = roleActionTrigger.getAttribute("data-role-action");

      if (action === "new") {
        openRoleForm("new");
      } else if (action === "edit" && selectedRoleId) {
        openRoleForm("edit");
      } else if (action === "delete" && selectedRoleId) {
        deleteSelectedRole();
      } else if (action === "cancel") {
        closeRoleForm();
      }
    }
  });

  if (personFormNode) {
    personFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      savePersonFromForm(personFormNode);
    });
  }

  if (roleFormNode) {
    roleFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      saveRoleFromForm(roleFormNode);
    });
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
