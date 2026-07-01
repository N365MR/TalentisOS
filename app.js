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
  const taskSummaryDueTodayNode = document.querySelector(
    "[data-task-summary-due-today]"
  );
  const taskSummaryOverdueNode = document.querySelector(
    "[data-task-summary-overdue]"
  );
  const taskSummaryHighPriorityNode = document.querySelector(
    "[data-task-summary-high-priority]"
  );
  const taskSummaryCompletedNode = document.querySelector(
    "[data-task-summary-completed]"
  );
  const taskCardListNode = document.querySelector("[data-task-card-list]");
  const taskProfileNameNode = document.querySelector("[data-task-profile-name]");
  const taskProfileNode = document.querySelector("[data-task-profile]");
  const taskFormNode = document.querySelector("[data-task-form]");
  const taskFormTitleNode = document.querySelector("[data-task-form-title]");
  const taskFormErrorNode = document.querySelector("[data-task-form-error]");
  const taskOwnerSelectNode = document.querySelector("[data-task-owner-select]");
  const taskPersonSelectNode = document.querySelector("[data-task-person-select]");
  const taskMeetingSelectNode = document.querySelector("[data-task-meeting-select]");
  const taskKpiSelectNode = document.querySelector("[data-task-kpi-select]");
  const taskIssueSelectNode = document.querySelector("[data-task-issue-select]");
  const taskSopSelectNode = document.querySelector("[data-task-sop-select]");
  const taskOwnerFilterNode = document.querySelector("[data-task-owner-filter]");
  const meetingSummaryTodayNode = document.querySelector("[data-meeting-summary-today]");
  const meetingSummaryActionsNode = document.querySelector(
    "[data-meeting-summary-actions]"
  );
  const meetingSummaryRatingNode = document.querySelector(
    "[data-meeting-summary-rating]"
  );
  const meetingCardListNode = document.querySelector("[data-meeting-card-list]");
  const meetingProfileNameNode = document.querySelector(
    "[data-meeting-profile-name]"
  );
  const meetingProfileNode = document.querySelector("[data-meeting-profile]");
  const meetingFormNode = document.querySelector("[data-meeting-form]");
  const meetingFormTitleNode = document.querySelector(
    "[data-meeting-form-title]"
  );
  const meetingFormErrorNode = document.querySelector(
    "[data-meeting-form-error]"
  );
  const meetingTypeSelectNode = document.querySelector(
    "[data-meeting-type-select]"
  );
  const meetingAgendaNode = document.querySelector("[data-meeting-agenda]");
  const kpiSummaryGreenNode = document.querySelector("[data-kpi-summary-green]");
  const kpiSummaryAmberNode = document.querySelector("[data-kpi-summary-amber]");
  const kpiWarRoomListNode = document.querySelector("[data-kpi-war-room-list]");
  const kpiCardListNode = document.querySelector("[data-kpi-card-list]");
  const kpiProfileNameNode = document.querySelector("[data-kpi-profile-name]");
  const kpiProfileNode = document.querySelector("[data-kpi-profile]");
  const kpiFormNode = document.querySelector("[data-kpi-form]");
  const kpiFormTitleNode = document.querySelector("[data-kpi-form-title]");
  const kpiFormErrorNode = document.querySelector("[data-kpi-form-error]");
  const kpiOwnerSelectNode = document.querySelector("[data-kpi-owner-select]");
  const rockSummaryTotalNode = document.querySelector("[data-rock-summary-total]");
  const rockSummaryRiskNode = document.querySelector("[data-rock-summary-risk]");
  const rockCardListNode = document.querySelector("[data-rock-card-list]");
  const rockProfileNameNode = document.querySelector("[data-rock-profile-name]");
  const rockProfileNode = document.querySelector("[data-rock-profile]");
  const rockFormNode = document.querySelector("[data-rock-form]");
  const rockFormTitleNode = document.querySelector("[data-rock-form-title]");
  const rockFormErrorNode = document.querySelector("[data-rock-form-error]");
  const rockOwnerSelectNode = document.querySelector("[data-rock-owner-select]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  let selectedPersonId = null;
  let selectedRoleId = null;
  let selectedTaskId = null;
  let activeTaskFilter = "all";
  let activeTaskOwnerFilter = "";
  let selectedMeetingId = null;
  let selectedKpiId = null;
  let selectedRockId = null;

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

  const getMeetingTitleById = (meetingId) => {
    const meeting = appState.meetings.find((item) => item.id === meetingId);
    return meeting ? meeting.title : "No linked meeting";
  };

  const getKpiNameById = (kpiId) => {
    const kpi = appState.kpis.find((item) => item.id === kpiId || item.name === kpiId);
    return kpi ? kpi.name : "No linked KPI";
  };

  const getIssueTitleById = (issueId) => {
    const issue = appState.issues.find((item) => item.id === issueId);
    return issue ? issue.title : "No linked issue";
  };

  const getSopTitleById = (sopId) => {
    const sop = appState.sops.find((item) => item.id === sopId || item.title === sopId);
    return sop ? sop.title : "No linked SOP";
  };

  const formatStatusLabel = (value) =>
    String(value || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());

  const getMeetingTypeLabel = (type) =>
    ({
      morning_huddle: "Morning Huddle",
      eod_handover: "End-of-Day Handover",
      one_on_one: "One-on-One",
      l10: "L10 EOS Meeting",
      team_meeting: "Team Meeting",
      weekly_review: "Weekly Review",
    })[type] || formatStatusLabel(type);

  const getAgendaTemplate = (type) =>
    ({
      morning_huddle: [
        "Yesterday’s carryovers",
        "Today’s priorities",
        "Staff availability",
        "Customer issues",
        "KPI exceptions",
        "Risks/blockers",
        "Commitments",
        "Recognition",
      ],
      eod_handover: [
        "Completed today",
        "Still open",
        "Blocked",
        "Customer risks",
        "Team risks",
        "Decisions made",
        "Tomorrow’s priorities",
        "Absence coverage notes",
      ],
      one_on_one: [
        "Check-in",
        "Priorities",
        "Blockers",
        "Support needed",
        "Development",
        "Feedback",
        "Commitments",
        "Follow-up actions",
      ],
      l10: [
        "Segue",
        "Scorecard",
        "Rocks",
        "Customer/employee headlines",
        "To-do review",
        "IDS",
        "Conclude",
        "Meeting rating",
      ],
      team_meeting: [
        "Wins",
        "Priorities",
        "Cross-team blockers",
        "Commitments",
      ],
      weekly_review: [
        "Week in review",
        "KPIs",
        "People updates",
        "Risks",
        "Next week priorities",
      ],
    })[type] || [];

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

  const formatDateTimeLocal = (value) => {
    const date = parseDateInput(value);

    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

  function createDefaultTask(task = {}) {
    return {
      id: task.id || generateId("task"),
      title: task.title || "",
      ownerId: task.ownerId || "",
      status: task.status || "open",
      priority: task.priority || "medium",
      dueDate: task.dueDate || "",
      category: task.category || "operations",
      linkedPersonId: task.linkedPersonId || task.memberId || "",
      linkedMeetingId: task.linkedMeetingId || "",
      linkedKpiId: task.linkedKpiId || "",
      linkedIssueId: task.linkedIssueId || "",
      linkedSopId: task.linkedSopId || "",
      completionNotes: task.completionNotes || "",
    };
  }

  function createDefaultMeetingAction(action = {}) {
    return {
      id: action.id || generateId("meeting_action"),
      title: action.title || "",
      ownerId: action.ownerId || "",
      dueDate: action.dueDate || "",
      category: action.category || "meeting_action",
      convertedTaskId: action.convertedTaskId || "",
    };
  }

  function createDefaultMeeting(meeting = {}) {
    return {
      id: meeting.id || generateId("meeting"),
      title: meeting.title || "",
      cadence: meeting.cadence || "",
      ownerId: meeting.ownerId || "",
      scheduledAt: meeting.scheduledAt || "",
      type: meeting.type || "team_meeting",
      attendees: Array.isArray(meeting.attendees) ? meeting.attendees : [],
      agenda: Array.isArray(meeting.agenda) ? meeting.agenda : [],
      notes: meeting.notes || "",
      decisions: Array.isArray(meeting.decisions) ? meeting.decisions : [],
      issuesRaised: Array.isArray(meeting.issuesRaised) ? meeting.issuesRaised : [],
      actions: Array.isArray(meeting.actions)
        ? meeting.actions.map((action) => createDefaultMeetingAction(action))
        : [],
      rating: meeting.rating ?? "",
      followUpNotes: meeting.followUpNotes || "",
    };
  }

  function createDefaultKpi(kpi = {}) {
    return {
      id: kpi.id || generateId("kpi"),
      name: kpi.name || "",
      ownerId: kpi.ownerId || "",
      category: kpi.category || "operations",
      target:
        kpi.target === "" || kpi.target === null || typeof kpi.target === "undefined"
          ? ""
          : Number(kpi.target),
      actual:
        kpi.actual === "" || kpi.actual === null || typeof kpi.actual === "undefined"
          ? ""
          : Number(kpi.actual),
      unit: kpi.unit || "",
      status: kpi.status || "green",
      trend: kpi.trend || "flat",
      reviewFrequency: kpi.reviewFrequency || "weekly",
      correctiveAction: kpi.correctiveAction || "",
      notes: kpi.notes || "",
      linkedTaskIds: Array.isArray(kpi.linkedTaskIds) ? kpi.linkedTaskIds : [],
      linkedIssueIds: Array.isArray(kpi.linkedIssueIds) ? kpi.linkedIssueIds : [],
      linkedSopIds: Array.isArray(kpi.linkedSopIds) ? kpi.linkedSopIds : [],
    };
  }

  function createDefaultRock(rock = {}) {
    return {
      id: rock.id || generateId("rock"),
      title: rock.title || "",
      ownerId: rock.ownerId || "",
      quarter: rock.quarter || "",
      dueDate: rock.dueDate || "",
      status: rock.status || "on_track",
      progress:
        rock.progress === "" || rock.progress === null || typeof rock.progress === "undefined"
          ? 0
          : Math.max(0, Math.min(100, Number(rock.progress) || 0)),
      milestones: Array.isArray(rock.milestones) ? rock.milestones : [],
      blockers: rock.blockers || "",
      notes: rock.notes || "",
      linkedTaskIds: Array.isArray(rock.linkedTaskIds) ? rock.linkedTaskIds : [],
      linkedIssueIds: Array.isArray(rock.linkedIssueIds) ? rock.linkedIssueIds : [],
      linkedKpiIds: Array.isArray(rock.linkedKpiIds) ? rock.linkedKpiIds : [],
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
      createDefaultTask({
        title: "Close overdue field install defects",
        ownerId: state.teamMembers[1].id,
        status: "in_progress",
        priority: "high",
        dueDate: "2026-07-01",
        category: "operations",
        linkedPersonId: state.teamMembers[1].id,
        linkedMeetingId: "meeting_huddle",
        linkedKpiId: "kpi_first_time_fix",
        linkedIssueId: "issue_install_rework",
      }),
      createDefaultTask({
        title: "Prepare one-on-one follow-up for Mia",
        ownerId: state.managerProfile.id,
        status: "open",
        priority: "medium",
        dueDate: "2026-07-01",
        category: "people_action",
        linkedPersonId: state.teamMembers[0].id,
        linkedMeetingId: "meeting_1on1_mia",
      }),
      createDefaultTask({
        title: "Review amber training completion report",
        ownerId: state.teamMembers[2].id,
        status: "blocked",
        priority: "medium",
        dueDate: "2026-07-02",
        category: "kpi_action",
        linkedPersonId: state.teamMembers[2].id,
        linkedMeetingId: "meeting_training_review",
        linkedKpiId: "kpi_training_completion",
        linkedIssueId: "issue_induction_gap",
        linkedSopId: "Induction Checklist SOP",
      }),
      createDefaultTask({
        title: "Confirm owner for repeat service callback actions",
        ownerId: state.teamMembers[0].id,
        status: "open",
        priority: "high",
        dueDate: "2026-07-02",
        category: "meeting_action",
        linkedPersonId: state.teamMembers[0].id,
        linkedMeetingId: "meeting_l10",
        linkedKpiId: "kpi_service_callback_rate",
        linkedIssueId: "issue_callback_spike",
      }),
      createDefaultTask({
        title: "Archive resolved huddle action notes",
        ownerId: state.teamMembers[3].id,
        status: "completed",
        priority: "low",
        dueDate: "2026-07-01",
        category: "meeting_action",
        linkedMeetingId: "meeting_huddle",
        completionNotes: "Action notes consolidated into the dispatch close handover.",
      }),
    ];

    state.meetings = [
      createDefaultMeeting({
        id: "meeting_huddle",
        title: "Morning Huddle",
        cadence: "daily",
        ownerId: state.teamMembers[0].id,
        scheduledAt: "2026-07-02T08:30:00+10:00",
        type: "morning_huddle",
        attendees: [state.teamMembers[0].name, state.teamMembers[1].name, state.teamMembers[3].name],
        agenda: [
          "Yesterday’s carryovers",
          "Today’s priorities",
          "Staff availability",
          "Customer issues",
          "KPI exceptions",
          "Risks/blockers",
          "Commitments",
          "Recognition",
        ],
        notes: "Focus on repeat callbacks and install rework carryover.",
        decisions: ["Escalate metro callback review by 10:00"],
        issuesRaised: ["Install defect closure lag"],
        actions: [
          createDefaultMeetingAction({
            title: "Close install carryover exception",
            ownerId: state.teamMembers[1].id,
            dueDate: "2026-07-02",
            category: "meeting_action",
          }),
        ],
        rating: 8,
        followUpNotes: "Recheck outstanding defects before lunch.",
      }),
      createDefaultMeeting({
        id: "meeting_1on1_mia",
        title: "One-on-One: Mia Chen",
        cadence: "weekly",
        ownerId: state.managerProfile.id,
        scheduledAt: "2026-07-02T11:00:00+10:00",
        type: "one_on_one",
        attendees: [state.managerProfile.name, state.teamMembers[0].name],
        agenda: [
          "Check-in",
          "Priorities",
          "Blockers",
          "Support needed",
          "Development",
          "Feedback",
          "Commitments",
          "Follow-up actions",
        ],
        notes: "Discuss service escalation coaching and delegation.",
        decisions: ["Trial a clearer escalation close checklist"],
        issuesRaised: ["Callbacks still consuming reactive time"],
        actions: [
          createDefaultMeetingAction({
            title: "Review Mia coaching follow-up",
            ownerId: state.managerProfile.id,
            dueDate: "2026-07-03",
            category: "people_action",
          }),
        ],
        rating: 7,
        followUpNotes: "Check progress next week.",
      }),
      createDefaultMeeting({
        id: "meeting_l10",
        title: "Leadership L10",
        cadence: "weekly",
        ownerId: state.managerProfile.id,
        scheduledAt: "2026-07-02T09:00:00+10:00",
        type: "l10",
        attendees: [state.managerProfile.name, state.teamMembers[0].name, state.teamMembers[2].name],
        agenda: [
          "Segue",
          "Scorecard",
          "Rocks",
          "Customer/employee headlines",
          "To-do review",
          "IDS",
          "Conclude",
          "Meeting rating",
        ],
        notes: "Scorecard red flags reviewed ahead of IDS.",
        decisions: ["Prioritise callback reduction rock support this week"],
        issuesRaised: ["Training completion is still red"],
        actions: [
          createDefaultMeetingAction({
            title: "Assign callback correction owner",
            ownerId: state.teamMembers[0].id,
            dueDate: "2026-07-02",
            category: "kpi_action",
          }),
          createDefaultMeetingAction({
            title: "Update training escalation review",
            ownerId: state.teamMembers[2].id,
            dueDate: "2026-07-03",
            category: "meeting_action",
          }),
        ],
        rating: 8,
        followUpNotes: "Review IDS outcomes in tomorrow's huddle.",
      }),
      createDefaultMeeting({
        id: "meeting_handover",
        title: "End-of-Day Handover",
        cadence: "daily",
        ownerId: state.teamMembers[3].id,
        scheduledAt: "2026-07-02T17:00:00+10:00",
        type: "eod_handover",
        attendees: [state.teamMembers[3].name, state.teamMembers[1].name],
        agenda: [
          "Completed today",
          "Still open",
          "Blocked",
          "Customer risks",
          "Team risks",
          "Decisions made",
          "Tomorrow’s priorities",
          "Absence coverage notes",
        ],
        notes: "Prepare dispatch and install open loops for tomorrow.",
        decisions: ["Carry open install defect review into morning huddle"],
        issuesRaised: ["Late dispatch dependency still unresolved"],
        actions: [
          createDefaultMeetingAction({
            title: "Prepare tomorrow dispatch priority list",
            ownerId: state.teamMembers[3].id,
            dueDate: "2026-07-02",
            category: "meeting_action",
          }),
        ],
        rating: 6,
        followUpNotes: "Use handover notes to anchor tomorrow's open loop review.",
      }),
    ];

    state.kpis = [
      createDefaultKpi({
        id: "kpi_first_time_fix",
        name: "First Time Fix",
        ownerId: state.teamMembers[0].id,
        category: "operations",
        target: 92,
        actual: 88,
        unit: "%",
        status: "amber",
        trend: "down",
        reviewFrequency: "weekly",
        correctiveAction: "Review repeat rework causes in the morning huddle and close carryovers by midday.",
        notes: "Metro zone install defects are impacting same-day closure.",
        linkedTaskIds: [state.tasks[0].id],
        linkedIssueIds: ["issue_install_rework"],
        linkedSopIds: ["Morning Huddle SOP"],
      }),
      createDefaultKpi({
        id: "kpi_training_completion",
        name: "Training Completion",
        ownerId: state.teamMembers[2].id,
        category: "training",
        target: 100,
        actual: 84,
        unit: "%",
        status: "red",
        trend: "flat",
        reviewFrequency: "weekly",
        correctiveAction: "Escalate incomplete induction plans and review overdue training in the weekly leadership L10.",
        notes: "Two newer team members are behind the expected training rhythm.",
        linkedTaskIds: [state.tasks[2].id],
        linkedIssueIds: ["issue_induction_gap"],
        linkedSopIds: ["Induction Checklist SOP"],
      }),
      createDefaultKpi({
        id: "kpi_service_callback_rate",
        name: "Service Callback Rate",
        ownerId: state.teamMembers[0].id,
        category: "customer",
        target: 3,
        actual: 5,
        unit: "%",
        status: "red",
        trend: "up",
        reviewFrequency: "daily",
        correctiveAction: "Assign callback correction ownership and review the previous day's repeat faults before 10:00.",
        notes: "Customer repeat demand is increasing in the metro service zone.",
        linkedTaskIds: [state.tasks[3].id],
        linkedIssueIds: ["issue_callback_spike"],
        linkedSopIds: ["Morning Huddle SOP"],
      }),
      createDefaultKpi({
        id: generateId("kpi"),
        name: "Handover Completion",
        ownerId: state.teamMembers[3].id,
        category: "delivery",
        target: 100,
        actual: 98,
        unit: "%",
        status: "green",
        trend: "up",
        reviewFrequency: "daily",
        correctiveAction: "",
        notes: "Late shift handover quality is stable this week.",
        linkedTaskIds: [],
        linkedIssueIds: [],
        linkedSopIds: ["Dispatch Close Handover SOP"],
      }),
    ];

    state.rocks = [
      createDefaultRock({
        id: generateId("rock"),
        title: "Lift morning huddle discipline across all teams",
        ownerId: state.managerProfile.id,
        quarter: "Q3 2026",
        dueDate: "2026-09-30",
        status: "on_track",
        progress: 62,
        milestones: [
          "Publish the daily huddle structure",
          "Train team leads on escalation review",
          "Audit huddle completion for ten working days",
        ],
        blockers: "",
        notes: "Good adoption is visible, but consistency still needs reinforcement across late shifts.",
        linkedTaskIds: [state.tasks[1].id],
        linkedIssueIds: ["issue_callback_spike"],
        linkedKpiIds: ["kpi_first_time_fix"],
      }),
      createDefaultRock({
        id: generateId("rock"),
        title: "Reduce repeat callbacks by 20 percent",
        ownerId: state.teamMembers[0].id,
        quarter: "Q3 2026",
        dueDate: "2026-09-30",
        status: "at_risk",
        progress: 34,
        milestones: [
          "Diagnose top callback causes",
          "Assign corrective actions by owner",
          "Review callback trend in each L10",
        ],
        blockers: "Owner follow-through is inconsistent on repeat-fault close-out.",
        notes: "This rock is feeding directly into the service callback KPI risk.",
        linkedTaskIds: [state.tasks[3].id],
        linkedIssueIds: ["issue_callback_spike"],
        linkedKpiIds: ["kpi_service_callback_rate"],
      }),
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
    normalised.tasks = normalised.tasks.map((task) => createDefaultTask(task));
    normalised.meetings = normalised.meetings.map((meeting) =>
      createDefaultMeeting(meeting)
    );
    normalised.kpis = normalised.kpis.map((kpi) => createDefaultKpi(kpi));
    normalised.rocks = normalised.rocks.map((rock) => createDefaultRock(rock));
    const seededMeetings = seedSampleData().meetings.map((meeting) =>
      createDefaultMeeting(meeting)
    );
    seededMeetings.forEach((seededMeeting) => {
      const exists = normalised.meetings.some(
        (meeting) =>
          meeting.id === seededMeeting.id ||
          (seededMeeting.type === "eod_handover" &&
            meeting.type === "eod_handover")
      );

      if (!exists && seededMeeting.type === "eod_handover") {
        normalised.meetings.push(seededMeeting);
      }
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

  function resolveReferenceIds(rawValue, collection, labelKeys = ["id", "name", "title"]) {
    return parseTextList(rawValue).map((entry) => {
      const directMatch = collection.find((item) =>
        labelKeys.some((key) => String(item[key] || "") === entry)
      );

      return directMatch?.id || entry;
    });
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

  function ensureTaskSelection(filteredTasks = appState.tasks) {
    if (!selectedTaskId || !appState.tasks.some((item) => item.id === selectedTaskId)) {
      selectedTaskId = filteredTasks[0]?.id || appState.tasks[0]?.id || null;
      return;
    }

    if (
      filteredTasks.length > 0 &&
      !filteredTasks.some((item) => item.id === selectedTaskId)
    ) {
      selectedTaskId = filteredTasks[0].id;
    }
  }

  function ensureKpiSelection() {
    if (!selectedKpiId || !appState.kpis.some((item) => item.id === selectedKpiId)) {
      selectedKpiId = appState.kpis[0]?.id || null;
    }
  }

  function ensureRockSelection() {
    if (!selectedRockId || !appState.rocks.some((item) => item.id === selectedRockId)) {
      selectedRockId = appState.rocks[0]?.id || null;
    }
  }

  function populateKpiOwnerOptions(selectedOwnerId = "") {
    if (!kpiOwnerSelectNode) {
      return;
    }

    const options = [
      { value: appState.managerProfile.id, label: appState.managerProfile.name || "Manager" },
      ...appState.teamMembers.map((person) => ({
        value: person.id,
        label: person.name,
      })),
    ];

    kpiOwnerSelectNode.innerHTML = `<option value="">Select owner</option>${options
      .map(
        (item) => `
          <option value="${escapeHtml(item.value)}" ${
            item.value === selectedOwnerId ? "selected" : ""
          }>
            ${escapeHtml(item.label)}
          </option>
        `
      )
      .join("")}`;
  }

  function populateRockOwnerOptions(selectedOwnerId = "") {
    if (!rockOwnerSelectNode) {
      return;
    }

    const options = [
      { value: appState.managerProfile.id, label: appState.managerProfile.name || "Manager" },
      ...appState.teamMembers.map((person) => ({
        value: person.id,
        label: person.name,
      })),
    ];

    rockOwnerSelectNode.innerHTML = `<option value="">Select owner</option>${options
      .map(
        (item) => `
          <option value="${escapeHtml(item.value)}" ${
            item.value === selectedOwnerId ? "selected" : ""
          }>
            ${escapeHtml(item.label)}
          </option>
        `
      )
      .join("")}`;
  }

  function openKpiForm(mode = "new") {
    if (!kpiFormNode) {
      return;
    }

    const selectedKpi =
      mode === "edit" ? appState.kpis.find((kpi) => kpi.id === selectedKpiId) : null;

    populateKpiOwnerOptions(selectedKpi?.ownerId || "");
    kpiFormNode.classList.add("is-open");
    kpiFormTitleNode.textContent = selectedKpi ? "Edit KPI" : "Add KPI";
    kpiFormNode.elements.kpiId.value = selectedKpi?.id || "";
    kpiFormNode.elements.name.value = selectedKpi?.name || "";
    kpiFormNode.elements.ownerId.value = selectedKpi?.ownerId || "";
    kpiFormNode.elements.category.value = selectedKpi?.category || "operations";
    kpiFormNode.elements.unit.value = selectedKpi?.unit || "";
    kpiFormNode.elements.target.value = selectedKpi?.target ?? "";
    kpiFormNode.elements.actual.value = selectedKpi?.actual ?? "";
    kpiFormNode.elements.status.value = selectedKpi?.status || "green";
    kpiFormNode.elements.trend.value = selectedKpi?.trend || "flat";
    kpiFormNode.elements.reviewFrequency.value =
      selectedKpi?.reviewFrequency || "weekly";
    kpiFormNode.elements.correctiveAction.value =
      selectedKpi?.correctiveAction || "";
    kpiFormNode.elements.notes.value = selectedKpi?.notes || "";
    kpiFormNode.elements.linkedTaskIds.value = formatListText(
      selectedKpi?.linkedTaskIds
    );
    kpiFormNode.elements.linkedIssueIds.value = formatListText(
      selectedKpi?.linkedIssueIds
    );
    kpiFormNode.elements.linkedSopIds.value = formatListText(
      selectedKpi?.linkedSopIds
    );
    if (kpiFormErrorNode) {
      kpiFormErrorNode.hidden = true;
      kpiFormErrorNode.textContent = "";
    }
  }

  function closeKpiForm() {
    kpiFormNode?.classList.remove("is-open");
    if (kpiFormNode) {
      kpiFormNode.reset();
      kpiFormNode.elements.kpiId.value = "";
    }
    if (kpiFormErrorNode) {
      kpiFormErrorNode.hidden = true;
      kpiFormErrorNode.textContent = "";
    }
  }

  function validateKpiForm(form) {
    const errors = [];

    if (!form.elements.name.value.trim()) {
      errors.push("KPI name is required.");
    }

    if (!form.elements.ownerId.value) {
      errors.push("KPI owner is required.");
    }

    if (
      form.elements.status.value === "red" &&
      !form.elements.correctiveAction.value.trim()
    ) {
      errors.push("Red KPI requires corrective action.");
    }

    return errors;
  }

  function saveKpiFromForm(form) {
    const errors = validateKpiForm(form);

    if (errors.length > 0) {
      if (kpiFormErrorNode) {
        kpiFormErrorNode.textContent = errors.join(" ");
        kpiFormErrorNode.hidden = false;
      }
      return;
    }

    const kpiId = form.elements.kpiId.value || generateId("kpi");
    const nextKpi = createDefaultKpi({
      id: kpiId,
      name: form.elements.name.value.trim(),
      ownerId: form.elements.ownerId.value,
      category: form.elements.category.value,
      unit: form.elements.unit.value.trim(),
      target: form.elements.target.value,
      actual: form.elements.actual.value,
      status: form.elements.status.value,
      trend: form.elements.trend.value,
      reviewFrequency: form.elements.reviewFrequency.value,
      correctiveAction: form.elements.correctiveAction.value.trim(),
      notes: form.elements.notes.value.trim(),
      linkedTaskIds: resolveReferenceIds(form.elements.linkedTaskIds.value, appState.tasks, [
        "id",
        "title",
      ]),
      linkedIssueIds: resolveReferenceIds(
        form.elements.linkedIssueIds.value,
        appState.issues,
        ["id", "title"]
      ),
      linkedSopIds: resolveReferenceIds(form.elements.linkedSopIds.value, appState.sops, [
        "id",
        "title",
      ]),
    });

    const existingIndex = appState.kpis.findIndex((kpi) => kpi.id === kpiId);

    if (existingIndex >= 0) {
      appState.kpis.splice(existingIndex, 1, nextKpi);
    } else {
      appState.kpis.push(nextKpi);
    }

    selectedKpiId = nextKpi.id;
    saveState(appState);
    closeKpiForm();
    showToast("KPI saved", `${nextKpi.name} was saved locally.`);
  }

  function deleteSelectedKpi() {
    const kpi = appState.kpis.find((item) => item.id === selectedKpiId);

    if (!kpi) {
      return;
    }

    const shouldDelete = window.confirm(`Delete the KPI "${kpi.name}" from TalentisOS?`);

    if (!shouldDelete) {
      return;
    }

    appState.roles = appState.roles.map((role) => ({
      ...role,
      kpiIds: role.kpiIds.filter((id) => id !== kpi.id && id !== kpi.name),
    }));
    appState.rocks = appState.rocks.map((rock) => ({
      ...rock,
      linkedKpiIds: rock.linkedKpiIds.filter((id) => id !== kpi.id && id !== kpi.name),
    }));
    appState.tasks = appState.tasks.map((task) => ({
      ...task,
      linkedKpiId: task.linkedKpiId === kpi.id ? "" : task.linkedKpiId,
    }));
    appState.kpis = appState.kpis.filter((item) => item.id !== kpi.id);
    selectedKpiId = null;
    saveState(appState);
    closeKpiForm();
    showToast("KPI deleted", `${kpi.name} was removed locally.`);
  }

  function renderKpiProfile(kpi) {
    if (!kpi) {
      return renderEmptyState("Select a KPI to view ownership, status, corrective action and linked work.");
    }

    const linkedTaskNames =
      kpi.linkedTaskIds.length > 0
        ? kpi.linkedTaskIds.map((id) => {
            const task = appState.tasks.find((item) => item.id === id || item.title === id);
            return task?.title || id;
          })
        : [];
    const linkedIssueNames =
      kpi.linkedIssueIds.length > 0
        ? kpi.linkedIssueIds.map((id) => {
            const issue = appState.issues.find((item) => item.id === id || item.title === id);
            return issue?.title || id;
          })
        : [];
    const linkedSopNames =
      kpi.linkedSopIds.length > 0
        ? kpi.linkedSopIds.map((id) => {
            const sop = appState.sops.find((item) => item.id === id || item.title === id);
            return sop?.title || id;
          })
        : [];
    const isGovernanceRisk = !kpi.ownerId;

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(formatStatusLabel(kpi.status))}</span>
          <span class="tag-pill">${escapeHtml(formatStatusLabel(kpi.category))}</span>
          <span class="tag-pill">${escapeHtml(formatStatusLabel(kpi.trend))}</span>
        </div>
        <div class="management-stat-grid">
          <div class="management-stat">
            <p class="management-stat__label">Owner</p>
            <p class="management-stat__value">${escapeHtml(getPersonNameById(kpi.ownerId))}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Review frequency</p>
            <p class="management-stat__value">${escapeHtml(
              formatStatusLabel(kpi.reviewFrequency)
            )}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Target</p>
            <p class="management-stat__value">${escapeHtml(
              `${kpi.target}${kpi.unit ? ` ${kpi.unit}` : ""}`
            )}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Actual</p>
            <p class="management-stat__value">${escapeHtml(
              `${kpi.actual}${kpi.unit ? ` ${kpi.unit}` : ""}`
            )}</p>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Corrective action</h4>
          <p class="management-profile__copy">${escapeHtml(
            kpi.correctiveAction || "No corrective action is required currently."
          )}</p>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Notes</h4>
          <p class="management-profile__copy">${escapeHtml(
            kpi.notes || "No KPI notes captured yet."
          )}</p>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Linked execution</h4>
          <p class="management-profile__copy">Tasks: ${escapeHtml(
            linkedTaskNames.length > 0 ? linkedTaskNames.join(", ") : "None linked"
          )}</p>
          <p class="management-profile__copy">Issues: ${escapeHtml(
            linkedIssueNames.length > 0 ? linkedIssueNames.join(", ") : "None linked"
          )}</p>
          <p class="management-profile__copy">SOPs: ${escapeHtml(
            linkedSopNames.length > 0 ? linkedSopNames.join(", ") : "None linked"
          )}</p>
        </div>
        <div class="alert-pill-row">
          ${
            isGovernanceRisk
              ? `<span class="alert-pill">Governance risk</span>`
              : `<span class="tag-pill">Owner visible</span>`
          }
          ${
            kpi.status === "red"
              ? `<span class="alert-pill">Corrective action active</span>`
              : ""
          }
        </div>
      </div>
    `;
  }

  function renderKpis() {
    ensureKpiSelection();
    populateKpiOwnerOptions();
    const selectedKpi = appState.kpis.find((item) => item.id === selectedKpiId) || null;
    const greenCount = appState.kpis.filter((kpi) => kpi.status === "green").length;
    const amberCount = appState.kpis.filter((kpi) => kpi.status === "amber").length;
    const warRoomKpis = appState.kpis.filter(
      (kpi) => kpi.status === "red" || kpi.status === "amber" || !kpi.ownerId
    );

    if (kpiSummaryGreenNode) {
      kpiSummaryGreenNode.textContent = String(greenCount);
    }

    if (kpiSummaryAmberNode) {
      kpiSummaryAmberNode.textContent = String(amberCount);
    }

    if (kpiWarRoomListNode) {
      kpiWarRoomListNode.innerHTML =
        warRoomKpis.length > 0
          ? warRoomKpis
              .map(
                (kpi) => `
                  <button
                    type="button"
                    class="management-card ${kpi.id === selectedKpiId ? "is-selected" : ""}"
                    data-select-kpi="${escapeHtml(kpi.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      !kpi.ownerId ? "Governance risk" : `${formatStatusLabel(kpi.status)} KPI`
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(kpi.name)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      `${kpi.actual}${kpi.unit ? ` ${kpi.unit}` : ""} actual • ${getPersonNameById(
                        kpi.ownerId
                      )}`
                    )}</p>
                  </button>
                `
              )
              .join("")
          : renderEmptyState("No red, amber or ownership-risk KPIs are active.");
    }

    if (kpiCardListNode) {
      kpiCardListNode.innerHTML =
        appState.kpis.length > 0
          ? appState.kpis
              .slice()
              .sort((left, right) => left.name.localeCompare(right.name))
              .map(
                (kpi) => `
                  <button
                    type="button"
                    class="management-card ${kpi.id === selectedKpiId ? "is-selected" : ""}"
                    data-select-kpi="${escapeHtml(kpi.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      formatStatusLabel(kpi.category)
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(kpi.name)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      `${formatStatusLabel(kpi.status)} • ${getPersonNameById(
                        kpi.ownerId
                      )}`
                    )}</p>
                    <div class="management-tags">
                      <span class="tag-pill">${escapeHtml(
                        `Target ${kpi.target}${kpi.unit ? ` ${kpi.unit}` : ""}`
                      )}</span>
                      <span class="tag-pill">${escapeHtml(
                        `Actual ${kpi.actual}${kpi.unit ? ` ${kpi.unit}` : ""}`
                      )}</span>
                    </div>
                  </button>
                `
              )
              .join("")
          : renderEmptyState("No KPIs exist yet. Add the first KPI to start your scorecard.");
    }

    if (kpiProfileNameNode) {
      kpiProfileNameNode.textContent = selectedKpi ? selectedKpi.name : "Select a KPI";
    }

    if (kpiProfileNode) {
      kpiProfileNode.innerHTML = renderKpiProfile(selectedKpi);
    }
  }

  function openRockForm(mode = "new") {
    if (!rockFormNode) {
      return;
    }

    const selectedRock =
      mode === "edit" ? appState.rocks.find((rock) => rock.id === selectedRockId) : null;

    populateRockOwnerOptions(selectedRock?.ownerId || "");
    rockFormNode.classList.add("is-open");
    rockFormTitleNode.textContent = selectedRock ? "Edit rock" : "Add rock";
    rockFormNode.elements.rockId.value = selectedRock?.id || "";
    rockFormNode.elements.title.value = selectedRock?.title || "";
    rockFormNode.elements.ownerId.value = selectedRock?.ownerId || "";
    rockFormNode.elements.quarter.value = selectedRock?.quarter || "";
    rockFormNode.elements.dueDate.value = selectedRock?.dueDate || "";
    rockFormNode.elements.status.value = selectedRock?.status || "on_track";
    rockFormNode.elements.progress.value = selectedRock?.progress ?? 0;
    rockFormNode.elements.milestones.value = formatListText(selectedRock?.milestones);
    rockFormNode.elements.blockers.value = selectedRock?.blockers || "";
    rockFormNode.elements.notes.value = selectedRock?.notes || "";
    rockFormNode.elements.linkedTaskIds.value = formatListText(
      selectedRock?.linkedTaskIds
    );
    rockFormNode.elements.linkedIssueIds.value = formatListText(
      selectedRock?.linkedIssueIds
    );
    rockFormNode.elements.linkedKpiIds.value = formatListText(
      selectedRock?.linkedKpiIds
    );
    if (rockFormErrorNode) {
      rockFormErrorNode.hidden = true;
      rockFormErrorNode.textContent = "";
    }
  }

  function closeRockForm() {
    rockFormNode?.classList.remove("is-open");
    if (rockFormNode) {
      rockFormNode.reset();
      rockFormNode.elements.rockId.value = "";
    }
    if (rockFormErrorNode) {
      rockFormErrorNode.hidden = true;
      rockFormErrorNode.textContent = "";
    }
  }

  function validateRockForm(form) {
    const errors = [];

    if (!form.elements.title.value.trim()) {
      errors.push("Rock title is required.");
    }

    if (!form.elements.ownerId.value) {
      errors.push("Rock owner is required.");
    }

    return errors;
  }

  function saveRockFromForm(form) {
    const errors = validateRockForm(form);

    if (errors.length > 0) {
      if (rockFormErrorNode) {
        rockFormErrorNode.textContent = errors.join(" ");
        rockFormErrorNode.hidden = false;
      }
      return;
    }

    const rockId = form.elements.rockId.value || generateId("rock");
    const nextRock = createDefaultRock({
      id: rockId,
      title: form.elements.title.value.trim(),
      ownerId: form.elements.ownerId.value,
      quarter: form.elements.quarter.value.trim(),
      dueDate: form.elements.dueDate.value,
      status: form.elements.status.value,
      progress: form.elements.progress.value,
      milestones: parseTextList(form.elements.milestones.value),
      blockers: form.elements.blockers.value.trim(),
      notes: form.elements.notes.value.trim(),
      linkedTaskIds: resolveReferenceIds(form.elements.linkedTaskIds.value, appState.tasks, [
        "id",
        "title",
      ]),
      linkedIssueIds: resolveReferenceIds(
        form.elements.linkedIssueIds.value,
        appState.issues,
        ["id", "title"]
      ),
      linkedKpiIds: resolveReferenceIds(form.elements.linkedKpiIds.value, appState.kpis, [
        "id",
        "name",
      ]),
    });

    const existingIndex = appState.rocks.findIndex((rock) => rock.id === rockId);

    if (existingIndex >= 0) {
      appState.rocks.splice(existingIndex, 1, nextRock);
    } else {
      appState.rocks.push(nextRock);
    }

    selectedRockId = nextRock.id;
    saveState(appState);
    closeRockForm();
    showToast("Rock saved", `${nextRock.title} was saved locally.`);
  }

  function deleteSelectedRock() {
    const rock = appState.rocks.find((item) => item.id === selectedRockId);

    if (!rock) {
      return;
    }

    const shouldDelete = window.confirm(`Delete the rock "${rock.title}" from TalentisOS?`);

    if (!shouldDelete) {
      return;
    }

    appState.rocks = appState.rocks.filter((item) => item.id !== rock.id);
    selectedRockId = null;
    saveState(appState);
    closeRockForm();
    showToast("Rock deleted", `${rock.title} was removed locally.`);
  }

  function renderRockProfile(rock) {
    if (!rock) {
      return renderEmptyState("Select a rock to view progress, blockers and linked execution.");
    }

    const linkedTaskNames =
      rock.linkedTaskIds.length > 0
        ? rock.linkedTaskIds.map((id) => {
            const task = appState.tasks.find((item) => item.id === id || item.title === id);
            return task?.title || id;
          })
        : [];
    const linkedIssueNames =
      rock.linkedIssueIds.length > 0
        ? rock.linkedIssueIds.map((id) => {
            const issue = appState.issues.find((item) => item.id === id || item.title === id);
            return issue?.title || id;
          })
        : [];
    const linkedKpiNames =
      rock.linkedKpiIds.length > 0
        ? rock.linkedKpiIds.map((id) => {
            const kpi = appState.kpis.find((item) => item.id === id || item.name === id);
            return kpi?.name || id;
          })
        : [];

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(formatStatusLabel(rock.status))}</span>
          <span class="tag-pill">${escapeHtml(rock.quarter || "Quarter not set")}</span>
          <span class="tag-pill">${escapeHtml(`${rock.progress}% complete`)}</span>
        </div>
        <div class="management-stat-grid">
          <div class="management-stat">
            <p class="management-stat__label">Owner</p>
            <p class="management-stat__value">${escapeHtml(getPersonNameById(rock.ownerId))}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Due date</p>
            <p class="management-stat__value">${escapeHtml(
              rock.dueDate ? formatDisplayDate(rock.dueDate) : "Not set"
            )}</p>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Progress</h4>
          <div class="rock-progress">
            <div
              class="dashboard-progress__track"
              role="progressbar"
              aria-label="${escapeHtml(rock.title)} progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="${escapeHtml(String(rock.progress))}"
            >
              <span
                class="dashboard-progress__fill"
                data-progress-fill
                data-progress-value="${escapeHtml(String(rock.progress))}"
                style="width: ${escapeHtml(String(prefersReducedMotion ? rock.progress : 0))}%"
              ></span>
            </div>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Milestones</h4>
          ${
            rock.milestones.length > 0
              ? `<ul class="management-profile__list">${rock.milestones
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No milestones captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Blockers and notes</h4>
          <p class="management-profile__copy">${escapeHtml(
            rock.blockers || "No blockers are currently captured."
          )}</p>
          <p class="management-profile__copy">${escapeHtml(
            rock.notes || "No rock notes captured yet."
          )}</p>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Linked execution</h4>
          <p class="management-profile__copy">Tasks: ${escapeHtml(
            linkedTaskNames.length > 0 ? linkedTaskNames.join(", ") : "None linked"
          )}</p>
          <p class="management-profile__copy">Issues: ${escapeHtml(
            linkedIssueNames.length > 0 ? linkedIssueNames.join(", ") : "None linked"
          )}</p>
          <p class="management-profile__copy">KPIs: ${escapeHtml(
            linkedKpiNames.length > 0 ? linkedKpiNames.join(", ") : "None linked"
          )}</p>
        </div>
      </div>
    `;
  }

  function renderRocks() {
    ensureRockSelection();
    populateRockOwnerOptions();
    const selectedRock = appState.rocks.find((item) => item.id === selectedRockId) || null;
    const atRiskCount = getRocksAtRisk().length;

    if (rockSummaryTotalNode) {
      rockSummaryTotalNode.textContent = `${appState.rocks.length} active rock${
        appState.rocks.length === 1 ? "" : "s"
      }`;
    }

    if (rockSummaryRiskNode) {
      rockSummaryRiskNode.textContent = `${atRiskCount} at risk`;
    }

    if (rockCardListNode) {
      rockCardListNode.innerHTML =
        appState.rocks.length > 0
          ? appState.rocks
              .slice()
              .sort((left, right) => left.title.localeCompare(right.title))
              .map(
                (rock) => `
                  <button
                    type="button"
                    class="management-card ${rock.id === selectedRockId ? "is-selected" : ""}"
                    data-select-rock="${escapeHtml(rock.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      formatStatusLabel(rock.status)
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(rock.title)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      `${getPersonNameById(rock.ownerId)} • ${rock.quarter || "Quarter not set"}`
                    )}</p>
                    <div class="rock-progress">
                      <div
                        class="dashboard-progress__track"
                        role="progressbar"
                        aria-label="${escapeHtml(rock.title)} progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${escapeHtml(String(rock.progress))}"
                      >
                        <span
                          class="dashboard-progress__fill"
                          data-progress-fill
                          data-progress-value="${escapeHtml(String(rock.progress))}"
                          style="width: ${escapeHtml(
                            String(prefersReducedMotion ? rock.progress : 0)
                          )}%"
                        ></span>
                      </div>
                    </div>
                    <div class="management-tags">
                      <span class="tag-pill">${escapeHtml(`${rock.progress}% complete`)}</span>
                    </div>
                  </button>
                `
              )
              .join("")
          : renderEmptyState("No rocks exist yet. Add the first rock to track EOS execution.");
    }

    if (rockProfileNameNode) {
      rockProfileNameNode.textContent = selectedRock ? selectedRock.title : "Select a rock";
    }

    if (rockProfileNode) {
      rockProfileNode.innerHTML = renderRockProfile(selectedRock);
    }
  }

  function populateTaskLinkOptions() {
    const ownerOptions = [
      { value: appState.managerProfile.id, label: appState.managerProfile.name || "Manager" },
      ...appState.teamMembers.map((person) => ({
        value: person.id,
        label: person.name,
      })),
    ];

    const renderOptions = (items, placeholder) =>
      `<option value="">${placeholder}</option>${items
        .map(
          (item) =>
            `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`
        )
        .join("")}`;

    if (taskOwnerSelectNode) {
      taskOwnerSelectNode.innerHTML = renderOptions(ownerOptions, "Select owner");
    }

    if (taskOwnerFilterNode) {
      taskOwnerFilterNode.innerHTML = renderOptions(ownerOptions, "All owners");
      taskOwnerFilterNode.value = activeTaskOwnerFilter;
    }

    if (taskPersonSelectNode) {
      taskPersonSelectNode.innerHTML = renderOptions(
        appState.teamMembers.map((person) => ({ value: person.id, label: person.name })),
        "No linked person"
      );
    }

    if (taskMeetingSelectNode) {
      taskMeetingSelectNode.innerHTML = renderOptions(
        appState.meetings.map((meeting) => ({
          value: meeting.id,
          label: meeting.title,
        })),
        "No linked meeting"
      );
    }

    if (taskKpiSelectNode) {
      taskKpiSelectNode.innerHTML = renderOptions(
        appState.kpis.map((kpi) => ({ value: kpi.id, label: kpi.name })),
        "No linked KPI"
      );
    }

    if (taskIssueSelectNode) {
      taskIssueSelectNode.innerHTML = renderOptions(
        appState.issues.map((issue) => ({ value: issue.id, label: issue.title })),
        "No linked issue"
      );
    }

    if (taskSopSelectNode) {
      taskSopSelectNode.innerHTML = renderOptions(
        appState.sops.map((sop) => ({ value: sop.id, label: sop.title })),
        "No linked SOP"
      );
    }
  }

  function getFilteredTasks() {
    const todayKey = getTodayKey();

    return appState.tasks.filter((task) => {
      const matchesOwner =
        activeTaskFilter !== "by_owner" ||
        !activeTaskOwnerFilter ||
        task.ownerId === activeTaskOwnerFilter;

      if (!matchesOwner) {
        return false;
      }

      switch (activeTaskFilter) {
        case "due_today":
          return !isTaskClosed(task) && task.dueDate === todayKey;
        case "overdue":
          return !isTaskClosed(task) && Boolean(task.dueDate) && task.dueDate < todayKey;
        case "high_priority":
          return !isTaskClosed(task) && task.priority === "high";
        case "by_owner":
          return activeTaskOwnerFilter ? task.ownerId === activeTaskOwnerFilter : true;
        case "completed":
          return isTaskClosed(task);
        case "meeting_actions":
          return task.category === "meeting_action" || Boolean(task.linkedMeetingId);
        case "kpi_actions":
          return task.category === "kpi_action" || Boolean(task.linkedKpiId);
        case "people_actions":
          return task.category === "people_action" || Boolean(task.linkedPersonId);
        case "all":
        default:
          return true;
      }
    });
  }

  function openTaskForm(mode = "new") {
    if (!taskFormNode) {
      return;
    }

    populateTaskLinkOptions();
    const selectedTask =
      mode === "edit"
        ? appState.tasks.find((task) => task.id === selectedTaskId)
        : null;

    taskFormNode.classList.add("is-open");
    taskFormTitleNode.textContent = selectedTask ? "Edit task" : "Add task";
    taskFormNode.elements.taskId.value = selectedTask?.id || "";
    taskFormNode.elements.title.value = selectedTask?.title || "";
    taskFormNode.elements.ownerId.value = selectedTask?.ownerId || "";
    taskFormNode.elements.dueDate.value = selectedTask?.dueDate || "";
    taskFormNode.elements.priority.value = selectedTask?.priority || "medium";
    taskFormNode.elements.status.value = selectedTask?.status || "open";
    taskFormNode.elements.category.value = selectedTask?.category || "operations";
    taskFormNode.elements.linkedPersonId.value = selectedTask?.linkedPersonId || "";
    taskFormNode.elements.linkedMeetingId.value = selectedTask?.linkedMeetingId || "";
    taskFormNode.elements.linkedKpiId.value = selectedTask?.linkedKpiId || "";
    taskFormNode.elements.linkedIssueId.value = selectedTask?.linkedIssueId || "";
    taskFormNode.elements.linkedSopId.value = selectedTask?.linkedSopId || "";
    taskFormNode.elements.completionNotes.value = selectedTask?.completionNotes || "";
    if (taskFormErrorNode) {
      taskFormErrorNode.hidden = true;
      taskFormErrorNode.textContent = "";
    }
  }

  function closeTaskForm() {
    taskFormNode?.classList.remove("is-open");
    if (taskFormNode) {
      taskFormNode.reset();
      taskFormNode.elements.taskId.value = "";
    }
    if (taskFormErrorNode) {
      taskFormErrorNode.hidden = true;
      taskFormErrorNode.textContent = "";
    }
  }

  function validateTaskForm(form) {
    const errors = [];

    if (!form.elements.ownerId.value) {
      errors.push("Task owner is required.");
    }

    if (!form.elements.dueDate.value) {
      errors.push("Task due date is required.");
    }

    return errors;
  }

  function saveTaskFromForm(form) {
    const errors = validateTaskForm(form);

    if (errors.length > 0) {
      if (taskFormErrorNode) {
        taskFormErrorNode.textContent = errors.join(" ");
        taskFormErrorNode.hidden = false;
      }
      return;
    }

    const taskId = form.elements.taskId.value || generateId("task");
    const nextTask = createDefaultTask({
      id: taskId,
      title: form.elements.title.value.trim(),
      ownerId: form.elements.ownerId.value,
      dueDate: form.elements.dueDate.value,
      priority: form.elements.priority.value,
      status: form.elements.status.value,
      category: form.elements.category.value,
      linkedPersonId: form.elements.linkedPersonId.value,
      linkedMeetingId: form.elements.linkedMeetingId.value,
      linkedKpiId: form.elements.linkedKpiId.value,
      linkedIssueId: form.elements.linkedIssueId.value,
      linkedSopId: form.elements.linkedSopId.value,
      completionNotes: form.elements.completionNotes.value.trim(),
    });

    const existingIndex = appState.tasks.findIndex((task) => task.id === taskId);

    if (existingIndex >= 0) {
      appState.tasks.splice(existingIndex, 1, nextTask);
    } else {
      appState.tasks.push(nextTask);
    }

    selectedTaskId = nextTask.id;
    saveState(appState);
    closeTaskForm();
    showToast("Task saved", `${nextTask.title} was saved locally.`);
  }

  function deleteSelectedTask() {
    const task = appState.tasks.find((item) => item.id === selectedTaskId);

    if (!task) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete the task "${task.title}" from TalentisOS?`
    );

    if (!shouldDelete) {
      return;
    }

    appState.tasks = appState.tasks.filter((item) => item.id !== task.id);
    selectedTaskId = null;
    saveState(appState);
    closeTaskForm();
    showToast("Task deleted", `${task.title} was removed locally.`);
  }

  function toggleSelectedTaskComplete() {
    const task = appState.tasks.find((item) => item.id === selectedTaskId);

    if (!task) {
      return;
    }

    const isClosed = isTaskClosed(task);
    task.status = isClosed ? "open" : "completed";

    if (!isClosed && !task.completionNotes) {
      task.completionNotes = "Completed and retained in the task history.";
    }

    saveState(appState);
    showToast(
      isClosed ? "Task reopened" : "Task completed",
      `${task.title} was ${isClosed ? "reopened" : "completed"} locally.`
    );
  }

  function renderTaskProfile(task) {
    if (!task) {
      return renderEmptyState("Select a task to view ownership, due date, links and completion notes.");
    }

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(formatStatusLabel(task.status))}</span>
          <span class="tag-pill">${escapeHtml(formatStatusLabel(task.priority))}</span>
          <span class="tag-pill">${escapeHtml(formatStatusLabel(task.category))}</span>
        </div>
        <div class="management-stat-grid">
          <div class="management-stat">
            <p class="management-stat__label">Owner</p>
            <p class="management-stat__value">${escapeHtml(
              getPersonNameById(task.ownerId)
            )}</p>
          </div>
          <div class="management-stat">
            <p class="management-stat__label">Due date</p>
            <p class="management-stat__value">${escapeHtml(
              task.dueDate ? formatDisplayDate(task.dueDate) : "Not set"
            )}</p>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Linked context</h4>
          <div class="task-link-summary">
            <p>Linked person: ${escapeHtml(
              task.linkedPersonId ? getPersonNameById(task.linkedPersonId) : "None"
            )}</p>
            <p>Linked meeting: ${escapeHtml(
              task.linkedMeetingId ? getMeetingTitleById(task.linkedMeetingId) : "None"
            )}</p>
            <p>Linked KPI: ${escapeHtml(
              task.linkedKpiId ? getKpiNameById(task.linkedKpiId) : "None"
            )}</p>
            <p>Linked issue: ${escapeHtml(
              task.linkedIssueId ? getIssueTitleById(task.linkedIssueId) : "None"
            )}</p>
            <p>Linked SOP: ${escapeHtml(
              task.linkedSopId ? getSopTitleById(task.linkedSopId) : "None"
            )}</p>
          </div>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Completion notes</h4>
          <p class="management-profile__copy">${escapeHtml(
            task.completionNotes || "No completion notes captured yet."
          )}</p>
        </div>
      </div>
    `;
  }

  function renderTasks() {
    populateTaskLinkOptions();
    const filteredTasks = getFilteredTasks();
    ensureTaskSelection(filteredTasks);
    const selectedTask =
      appState.tasks.find((task) => task.id === selectedTaskId) || null;
    const todayKey = getTodayKey();
    const highPriorityCount = appState.tasks.filter(
      (task) => !isTaskClosed(task) && task.priority === "high"
    ).length;
    const completedCount = appState.tasks.filter((task) => isTaskClosed(task)).length;

    if (taskSummaryDueTodayNode) {
      taskSummaryDueTodayNode.textContent = String(getTasksDueToday().length);
    }

    if (taskSummaryOverdueNode) {
      taskSummaryOverdueNode.textContent = String(getOverdueTasks().length);
    }

    if (taskSummaryHighPriorityNode) {
      taskSummaryHighPriorityNode.textContent = String(highPriorityCount);
    }

    if (taskSummaryCompletedNode) {
      taskSummaryCompletedNode.textContent = String(completedCount);
    }

    document.querySelectorAll("[data-task-filter]").forEach((button) => {
      const isActive = button.getAttribute("data-task-filter") === activeTaskFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (taskOwnerFilterNode) {
      taskOwnerFilterNode.closest(".task-owner-filter")?.classList.toggle(
        "is-visible",
        activeTaskFilter === "by_owner"
      );
    }

    if (taskCardListNode) {
      taskCardListNode.innerHTML =
        filteredTasks.length > 0
          ? filteredTasks
              .sort((left, right) => {
                if (isTaskClosed(left) !== isTaskClosed(right)) {
                  return isTaskClosed(left) ? 1 : -1;
                }

                return (left.dueDate || "").localeCompare(right.dueDate || "");
              })
              .map((task) => {
                const dueLabel = task.dueDate
                  ? task.dueDate < todayKey && !isTaskClosed(task)
                    ? `Overdue ${formatDisplayDate(task.dueDate)}`
                    : `Due ${formatDisplayDate(task.dueDate)}`
                  : "No due date";

                return `
                  <button
                    type="button"
                    class="management-card task-card ${
                      task.id === selectedTaskId ? "is-selected" : ""
                    } ${isTaskClosed(task) ? "task-card--completed" : ""}"
                    data-select-task="${escapeHtml(task.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      formatStatusLabel(task.category)
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(task.title)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      `${getPersonNameById(task.ownerId)} • ${dueLabel}`
                    )}</p>
                    <div class="task-card__status management-tags">
                      <span class="tag-pill">${escapeHtml(
                        formatStatusLabel(task.priority)
                      )}</span>
                      <span class="tag-pill">${escapeHtml(
                        formatStatusLabel(task.status)
                      )}</span>
                    </div>
                  </button>
                `;
              })
              .join("")
          : renderEmptyState("No tasks match the current filter.");
    }

    if (taskProfileNameNode) {
      taskProfileNameNode.textContent = selectedTask
        ? selectedTask.title
        : "Select a task";
    }

    if (taskProfileNode) {
      taskProfileNode.innerHTML = renderTaskProfile(selectedTask);
    }

    const toggleButton = document.querySelector('[data-task-action="toggle-complete"]');
    if (toggleButton) {
      toggleButton.textContent =
        selectedTask && isTaskClosed(selectedTask) ? "Reopen task" : "Complete task";
    }
  }

  function ensureMeetingSelection() {
    if (
      !selectedMeetingId ||
      !appState.meetings.some((meeting) => meeting.id === selectedMeetingId)
    ) {
      selectedMeetingId = appState.meetings[0]?.id || null;
    }
  }

  function parseMeetingActions(value) {
    return String(value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title = "", ownerRef = "", dueDate = "", category = "meeting_action"] =
          line.split("|").map((item) => item.trim());
        const matchedPerson = appState.teamMembers.find(
          (person) => person.id === ownerRef || person.name === ownerRef
        );
        const ownerId =
          ownerRef === appState.managerProfile.name || ownerRef === appState.managerProfile.id
            ? appState.managerProfile.id
            : matchedPerson?.id || ownerRef;

        return createDefaultMeetingAction({
          title,
          ownerId,
          dueDate,
          category: category || "meeting_action",
        });
      });
  }

  function formatMeetingActionsText(actions) {
    return actions
      .map(
        (action) =>
          `${action.title} | ${getPersonNameById(action.ownerId)} | ${action.dueDate} | ${action.category}`
      )
      .join("\n");
  }

  function getMeetingOpenActionsCount() {
    return appState.meetings.reduce((total, meeting) => {
      const openCount = meeting.actions.filter((action) => !action.convertedTaskId).length;
      return total + openCount;
    }, 0);
  }

  function getAverageMeetingRating() {
    const ratings = appState.meetings
      .map((meeting) => Number(meeting.rating))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (ratings.length === 0) {
      return 0;
    }

    return Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1));
  }

  function openMeetingForm(mode = "new") {
    if (!meetingFormNode) {
      return;
    }

    const selectedMeeting =
      mode === "edit"
        ? appState.meetings.find((meeting) => meeting.id === selectedMeetingId)
        : null;

    meetingFormNode.classList.add("is-open");
    meetingFormTitleNode.textContent = selectedMeeting ? "Edit meeting" : "Add meeting";
    meetingFormNode.elements.meetingId.value = selectedMeeting?.id || "";
    meetingFormNode.elements.title.value = selectedMeeting?.title || "";
    meetingFormNode.elements.type.value = selectedMeeting?.type || "morning_huddle";
    meetingFormNode.elements.scheduledAt.value = selectedMeeting
      ? formatDateTimeLocal(selectedMeeting.scheduledAt)
      : "";
    meetingFormNode.elements.rating.value = selectedMeeting?.rating ?? "";
    meetingFormNode.elements.attendees.value = formatListText(selectedMeeting?.attendees);
    meetingFormNode.elements.agenda.value = formatListText(
      selectedMeeting?.agenda || getAgendaTemplate(meetingFormNode.elements.type.value)
    );
    meetingFormNode.elements.notes.value = selectedMeeting?.notes || "";
    meetingFormNode.elements.decisions.value = formatListText(selectedMeeting?.decisions);
    meetingFormNode.elements.issuesRaised.value = formatListText(
      selectedMeeting?.issuesRaised
    );
    meetingFormNode.elements.actions.value = selectedMeeting
      ? formatMeetingActionsText(selectedMeeting.actions)
      : "";
    meetingFormNode.elements.followUpNotes.value = selectedMeeting?.followUpNotes || "";
    if (meetingTypeSelectNode) {
      meetingTypeSelectNode.dataset.previousType = meetingFormNode.elements.type.value;
    }
    if (meetingFormErrorNode) {
      meetingFormErrorNode.hidden = true;
      meetingFormErrorNode.textContent = "";
    }
  }

  function closeMeetingForm() {
    meetingFormNode?.classList.remove("is-open");
    if (meetingFormNode) {
      meetingFormNode.reset();
      meetingFormNode.elements.meetingId.value = "";
    }
    if (meetingFormErrorNode) {
      meetingFormErrorNode.hidden = true;
      meetingFormErrorNode.textContent = "";
    }
  }

  function saveMeetingFromForm(form) {
    const errors = [];

    if (!form.elements.title.value.trim()) {
      errors.push("Meeting title is required.");
    }

    if (!form.elements.scheduledAt.value) {
      errors.push("Meeting date is required.");
    }

    if (errors.length > 0) {
      if (meetingFormErrorNode) {
        meetingFormErrorNode.textContent = errors.join(" ");
        meetingFormErrorNode.hidden = false;
      }
      return;
    }

    const meetingId = form.elements.meetingId.value || generateId("meeting");
    const existingMeeting = appState.meetings.find((meeting) => meeting.id === meetingId);
    const parsedActions = parseMeetingActions(form.elements.actions.value).map((action) => {
      const existingAction = existingMeeting?.actions.find(
        (item) => item.title === action.title && item.dueDate === action.dueDate
      );

      return createDefaultMeetingAction({
        ...action,
        id: existingAction?.id || action.id,
        convertedTaskId: existingAction?.convertedTaskId || "",
      });
    });

    const nextMeeting = createDefaultMeeting({
      id: meetingId,
      title: form.elements.title.value.trim(),
      type: form.elements.type.value,
      scheduledAt: form.elements.scheduledAt.value,
      rating: form.elements.rating.value ? Number(form.elements.rating.value) : "",
      attendees: parseTextList(form.elements.attendees.value),
      agenda: parseTextList(form.elements.agenda.value),
      notes: form.elements.notes.value.trim(),
      decisions: parseTextList(form.elements.decisions.value),
      issuesRaised: parseTextList(form.elements.issuesRaised.value),
      actions: parsedActions,
      followUpNotes: form.elements.followUpNotes.value.trim(),
      ownerId: existingMeeting?.ownerId || appState.managerProfile.id,
      cadence: existingMeeting?.cadence || "",
    });

    const existingIndex = appState.meetings.findIndex(
      (meeting) => meeting.id === meetingId
    );

    if (existingIndex >= 0) {
      appState.meetings.splice(existingIndex, 1, nextMeeting);
    } else {
      appState.meetings.push(nextMeeting);
    }

    selectedMeetingId = nextMeeting.id;
    saveState(appState);
    closeMeetingForm();
    showToast("Meeting saved", `${nextMeeting.title} was saved locally.`);
  }

  function deleteSelectedMeeting() {
    const meeting = appState.meetings.find((item) => item.id === selectedMeetingId);

    if (!meeting) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete the meeting "${meeting.title}" from TalentisOS?`
    );

    if (!shouldDelete) {
      return;
    }

    appState.meetings = appState.meetings.filter((item) => item.id !== meeting.id);
    selectedMeetingId = null;
    saveState(appState);
    closeMeetingForm();
    showToast("Meeting deleted", `${meeting.title} was removed locally.`);
  }

  function convertMeetingActionToTask(meetingId, actionId) {
    const meeting = appState.meetings.find((item) => item.id === meetingId);
    const action = meeting?.actions.find((item) => item.id === actionId);

    if (!meeting || !action) {
      return;
    }

    if (!action.ownerId || !action.dueDate) {
      showToast(
        "Action not ready",
        "Meeting action requires an owner and due date before converting to a task.",
        "error"
      );
      return;
    }

    if (action.convertedTaskId) {
      showToast(
        "Already converted",
        "This meeting action already exists as a task."
      );
      return;
    }

    const nextTask = createDefaultTask({
      title: action.title,
      ownerId: action.ownerId,
      dueDate: action.dueDate,
      priority: "medium",
      status: "open",
      category: action.category || "meeting_action",
      linkedMeetingId: meeting.id,
      completionNotes: `Converted from ${meeting.title}.`,
    });

    appState.tasks.push(nextTask);
    action.convertedTaskId = nextTask.id;
    selectedTaskId = nextTask.id;
    saveState(appState);
    showToast("Action converted", `${action.title} was added to Tasks.`);
  }

  function renderMeetingProfile(meeting) {
    if (!meeting) {
      return renderEmptyState("Select a meeting to view agenda, decisions, issues and actions.");
    }

    return `
      <div class="management-profile">
        <div class="profile-chip-row">
          <span class="tag-pill">${escapeHtml(getMeetingTypeLabel(meeting.type))}</span>
          <span class="tag-pill">${escapeHtml(
            meeting.rating ? `Rating ${meeting.rating}/10` : "No rating"
          )}</span>
          <span class="tag-pill">${escapeHtml(
            meeting.scheduledAt ? formatDisplayDate(meeting.scheduledAt) : "No date"
          )}</span>
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Attendees</h4>
          ${
            meeting.attendees.length > 0
              ? `<ul class="management-profile__list">${meeting.attendees
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No attendees captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Agenda</h4>
          ${
            meeting.agenda.length > 0
              ? `<ul class="management-profile__list">${meeting.agenda
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No agenda captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Notes and decisions</h4>
          <p class="management-profile__copy">${escapeHtml(
            meeting.notes || "No notes captured yet."
          )}</p>
          ${
            meeting.decisions.length > 0
              ? `<ul class="management-profile__list">${meeting.decisions
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Issues raised</h4>
          ${
            meeting.issuesRaised.length > 0
              ? `<ul class="management-profile__list">${meeting.issuesRaised
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join("")}</ul>`
              : `<p class="management-profile__copy">No issues captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Actions</h4>
          ${
            meeting.actions.length > 0
              ? `<div class="meeting-action-list">${meeting.actions
                  .map(
                    (action) => `
                      <div class="meeting-action-item">
                        <p class="management-profile__heading">${escapeHtml(action.title)}</p>
                        <p class="meeting-action-item__meta">${escapeHtml(
                          `${getPersonNameById(action.ownerId)} • ${
                            action.dueDate ? formatDisplayDate(action.dueDate) : "No due date"
                          } • ${formatStatusLabel(action.category)}`
                        )}</p>
                        <div class="management-actions">
                          <button
                            class="button button--ghost"
                            type="button"
                            data-convert-meeting-action="${escapeHtml(action.id)}"
                            data-convert-meeting-parent="${escapeHtml(meeting.id)}"
                          >
                            ${action.convertedTaskId ? "Converted to task" : "Convert to task"}
                          </button>
                        </div>
                      </div>
                    `
                  )
                  .join("")}</div>`
              : `<p class="management-profile__copy">No actions captured yet.</p>`
          }
        </div>
        <div class="management-profile__section">
          <h4 class="management-profile__heading">Follow-up notes</h4>
          <p class="management-profile__copy">${escapeHtml(
            meeting.followUpNotes || "No follow-up notes captured yet."
          )}</p>
        </div>
      </div>
    `;
  }

  function renderMeetings() {
    ensureMeetingSelection();
    const selectedMeeting =
      appState.meetings.find((meeting) => meeting.id === selectedMeetingId) || null;
    const meetingsToday = getMeetingsToday();

    if (meetingSummaryTodayNode) {
      meetingSummaryTodayNode.textContent = String(meetingsToday.length);
    }

    if (meetingSummaryActionsNode) {
      meetingSummaryActionsNode.textContent = String(getMeetingOpenActionsCount());
    }

    if (meetingSummaryRatingNode) {
      meetingSummaryRatingNode.textContent = String(getAverageMeetingRating());
    }

    if (meetingCardListNode) {
      meetingCardListNode.innerHTML =
        appState.meetings.length > 0
          ? appState.meetings
              .slice()
              .sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))
              .map(
                (meeting) => `
                  <button
                    type="button"
                    class="management-card ${meeting.id === selectedMeetingId ? "is-selected" : ""}"
                    data-select-meeting="${escapeHtml(meeting.id)}"
                  >
                    <p class="today-list__eyebrow">${escapeHtml(
                      getMeetingTypeLabel(meeting.type)
                    )}</p>
                    <h4 class="management-card__title">${escapeHtml(meeting.title)}</h4>
                    <p class="management-card__meta">${escapeHtml(
                      `${meeting.scheduledAt ? formatDisplayDate(meeting.scheduledAt) : "No date"} • ${
                        meeting.actions.length
                      } action${meeting.actions.length === 1 ? "" : "s"}`
                    )}</p>
                  </button>
                `
              )
              .join("")
          : renderEmptyState("No meetings exist yet. Add the first meeting to build the leadership rhythm.");
    }

    if (meetingProfileNameNode) {
      meetingProfileNameNode.textContent = selectedMeeting
        ? selectedMeeting.title
        : "Select a meeting";
    }

    if (meetingProfileNode) {
      meetingProfileNode.innerHTML = renderMeetingProfile(selectedMeeting);
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
    renderTasks();
    renderMeetings();
    renderKpis();
    renderRocks();

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
    renderTasks,
    renderMeetings,
    renderKpis,
    renderRocks,
    convertMeetingActionToTask,
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

  if (taskCardListNode) {
    taskCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-task]");

      if (!trigger) {
        return;
      }

      selectedTaskId = trigger.getAttribute("data-select-task");
      renderStateSummary();
    });
  }

  if (meetingCardListNode) {
    meetingCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-meeting]");

      if (!trigger) {
        return;
      }

      selectedMeetingId = trigger.getAttribute("data-select-meeting");
      renderStateSummary();
    });
  }

  if (kpiCardListNode) {
    kpiCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-kpi]");

      if (!trigger) {
        return;
      }

      selectedKpiId = trigger.getAttribute("data-select-kpi");
      renderStateSummary();
    });
  }

  if (kpiWarRoomListNode) {
    kpiWarRoomListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-kpi]");

      if (!trigger) {
        return;
      }

      selectedKpiId = trigger.getAttribute("data-select-kpi");
      renderStateSummary();
    });
  }

  if (rockCardListNode) {
    rockCardListNode.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-rock]");

      if (!trigger) {
        return;
      }

      selectedRockId = trigger.getAttribute("data-select-rock");
      renderStateSummary();
    });
  }

  document.querySelectorAll("[data-task-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTaskFilter = button.getAttribute("data-task-filter") || "all";
      if (activeTaskFilter !== "by_owner") {
        activeTaskOwnerFilter = "";
      }
      renderStateSummary();
    });
  });

  if (taskOwnerFilterNode) {
    taskOwnerFilterNode.addEventListener("change", (event) => {
      activeTaskOwnerFilter = event.target.value;
      activeTaskFilter = "by_owner";
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

    const taskActionTrigger = event.target.closest("[data-task-action]");

    if (taskActionTrigger) {
      const action = taskActionTrigger.getAttribute("data-task-action");

      if (action === "new") {
        openTaskForm("new");
      } else if (action === "edit" && selectedTaskId) {
        openTaskForm("edit");
      } else if (action === "delete" && selectedTaskId) {
        deleteSelectedTask();
      } else if (action === "toggle-complete" && selectedTaskId) {
        toggleSelectedTaskComplete();
      } else if (action === "cancel") {
        closeTaskForm();
      }
    }

    const meetingActionTrigger = event.target.closest("[data-meeting-action]");

    if (meetingActionTrigger) {
      const action = meetingActionTrigger.getAttribute("data-meeting-action");

      if (action === "new") {
        openMeetingForm("new");
      } else if (action === "edit" && selectedMeetingId) {
        openMeetingForm("edit");
      } else if (action === "delete" && selectedMeetingId) {
        deleteSelectedMeeting();
      } else if (action === "cancel") {
        closeMeetingForm();
      }
    }

    const kpiActionTrigger = event.target.closest("[data-kpi-action]");

    if (kpiActionTrigger) {
      const action = kpiActionTrigger.getAttribute("data-kpi-action");

      if (action === "new") {
        openKpiForm("new");
      } else if (action === "edit" && selectedKpiId) {
        openKpiForm("edit");
      } else if (action === "delete" && selectedKpiId) {
        deleteSelectedKpi();
      } else if (action === "cancel") {
        closeKpiForm();
      }
    }

    const rockActionTrigger = event.target.closest("[data-rock-action]");

    if (rockActionTrigger) {
      const action = rockActionTrigger.getAttribute("data-rock-action");

      if (action === "new") {
        openRockForm("new");
      } else if (action === "edit" && selectedRockId) {
        openRockForm("edit");
      } else if (action === "delete" && selectedRockId) {
        deleteSelectedRock();
      } else if (action === "cancel") {
        closeRockForm();
      }
    }

    const convertMeetingActionTrigger = event.target.closest(
      "[data-convert-meeting-action]"
    );

    if (convertMeetingActionTrigger) {
      const meetingId = convertMeetingActionTrigger.getAttribute(
        "data-convert-meeting-parent"
      );
      const actionId = convertMeetingActionTrigger.getAttribute(
        "data-convert-meeting-action"
      );

      convertMeetingActionToTask(meetingId, actionId);
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

  if (taskFormNode) {
    taskFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      saveTaskFromForm(taskFormNode);
    });
  }

  if (meetingFormNode) {
    meetingFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      saveMeetingFromForm(meetingFormNode);
    });
  }

  if (kpiFormNode) {
    kpiFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      saveKpiFromForm(kpiFormNode);
    });
  }

  if (rockFormNode) {
    rockFormNode.addEventListener("submit", (event) => {
      event.preventDefault();
      saveRockFromForm(rockFormNode);
    });
  }

  if (meetingTypeSelectNode && meetingAgendaNode) {
    meetingTypeSelectNode.addEventListener("change", () => {
      const currentAgenda = meetingAgendaNode.value.trim();
      const currentTemplate = formatListText(
        getAgendaTemplate(meetingTypeSelectNode.dataset.previousType || "")
      );
      const nextTemplate = formatListText(getAgendaTemplate(meetingTypeSelectNode.value));

      if (!currentAgenda || currentAgenda === currentTemplate) {
        meetingAgendaNode.value = nextTemplate;
      }

      meetingTypeSelectNode.dataset.previousType = meetingTypeSelectNode.value;
    });
  }

  document.querySelectorAll("[data-meeting-eod-cta]").forEach((link) => {
    link.addEventListener("click", () => {
      const handoverMeeting = appState.meetings.find(
        (meeting) => meeting.type === "eod_handover"
      );

      if (handoverMeeting) {
        selectedMeetingId = handoverMeeting.id;
        renderStateSummary();
      }
    });
  });

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
