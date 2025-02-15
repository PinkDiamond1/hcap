import ToastStatus from './toast';
export const pageSizeOptions = [10, 30, 50, 100];

export const participantStatus = {
  OPEN: 'open',
  PROSPECTING: 'prospecting',
  interviewing: 'interviewing',
  OFFER_MAKDE: 'offer_made',
  ARCHIVED: 'archived',
  REJECTED: 'rejected',
  HIRED: 'hired',
  ROS: 'ros',
};

export const participantEngageStatus = {
  SINGLE_SELECT_SITE: 'single-select-site',
  MULTI_SELECT_SITE: 'multi-select-site',
  PROSPECTING_CONFIRM: 'prospecting',
};

export const tabs = {
  // Tabs, associated allowed roles, displayed statuses
  'Available Participants': {
    roles: ['employer', 'health_authority'],
    statuses: ['open'],
  },
  'My Candidates': {
    roles: ['employer', 'health_authority'],
    statuses: ['prospecting', 'interviewing', 'offer_made', 'unavailable'],
  },
  'Archived Candidates': {
    roles: ['employer', 'health_authority'],
    statuses: ['rejected', 'archived'],
  },
  'Hired Candidates': {
    roles: ['employer', 'health_authority'],
    statuses: ['hired', 'pending_acknowledgement'],
  },
  'Return Of Service': {
    roles: ['employer', 'health_authority'],
    statuses: ['ros', 'hired'],
  },
  Participants: {
    roles: ['ministry_of_health', 'superuser'],
    statuses: [
      'open',
      'prospecting',
      'interviewing',
      'offer_made',
      'archived',
      'rejected',
      'hired',
      'ros',
    ],
  },
};

export const makeToasts = (firstName, lastName) => {
  return {
    open: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} is has been disengaged`,
    },
    interviewing: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} is now being interviewed`,
    },
    offer_made: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} has been made a job offer`,
    },
    hired: {
      status: ToastStatus.Success,
      message: `${firstName} ${lastName} has been hired`,
    },
    rejected: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} has been archived`,
    },
    archived: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} has been archived`,
    },
    already_hired: {
      status: ToastStatus.Info,
      message: `${firstName} ${lastName} is already hired by someone else`,
    },
    invalid_status_transition: {
      status: ToastStatus.Error,
      message: `Unable to update status for ${firstName} ${lastName}`,
    },
    invalid_archive: {
      status: ToastStatus.Error,
      message: `Unable to archive ${firstName} ${lastName}`,
    },
  };
};

export const FILTERABLE_FIELDS = {
  FSA: 'fsaFilter',
  EMAIL: 'emailFilter',
  LASTNAME: 'lastNameFilter',
  REGION: 'regionFilter',
  IS_INDIGENOUS: 'isIndigenousFilter',
};

export const tabStatuses = {
  'Available Participants': ['open'],
  'My Candidates': ['prospecting', 'interviewing', 'offer_made', 'unavailable'],
  'Archived Candidates': ['rejected', 'archived'],
  'Hired Candidates': ['hired', 'pending_acknowledgement'],
  'Return Of Service': ['ros', 'hired'],
  Participants: [
    'open',
    'prospecting',
    'interviewing',
    'offer_made',
    'rejected',
    'hired',
    'archived',
    'ros',
  ],
};

export const tabsByRole = {
  superuser: ['Participants'],
  ministry_of_health: ['Participants'],
  health_authority: [
    'Available Participants',
    'My Candidates',
    'Archived Candidates',
    'Hired Candidates',
    'Return Of Service',
  ],
  employer: [
    'Available Participants',
    'My Candidates',
    'Archived Candidates',
    'Hired Candidates',
    'Return Of Service',
  ],
};

const columns = {
  id: { id: 'id', name: 'ID', sortOrder: 1 },
  lastName: { id: 'lastName', name: 'Last Name', sortOrder: 2 },
  firstName: { id: 'firstName', name: 'First Name', sortOrder: 3 },
  status: { id: 'status', name: 'Status', sortOrder: 4 },
  mohStatus: { id: 'mohStatus', name: 'Status', sortOrder: 5, sortable: false },
  statusInfo: { id: 'statusInfo', name: 'Status', sortOrder: 6 },
  postalCodeFsa: { id: 'postalCodeFsa', name: 'FSA', sortOrder: 7 },
  phoneNumber: { id: 'phoneNumber', name: 'Phone Number', sortOrder: 8 },
  emailAddress: { id: 'emailAddress', name: 'Email Address', sortOrder: 9 },
  preferredLocation: { id: 'preferredLocation', name: 'Preferred Region(s)', sortOrder: 10 },
  distance: { id: 'distance', name: 'Site Distance', sortOrder: 11 },
  interested: { id: 'interested', name: 'Interest', sortOrder: 12 },
  nonHCAP: { id: 'nonHCAP', name: 'Non-HCAP', sortOrder: 13 },
  crcClear: { id: 'crcClear', name: 'CRC Clear', sortOrder: 14 },
  callbackStatus: { id: 'callbackStatus', name: 'Callback Status', sortOrder: 15 },
  userUpdatedAt: { id: 'userUpdatedAt', name: 'Last Updated', sortOrder: 16 },
  engage: { id: 'engage', name: null, sortOrder: 50 },
  siteName: { id: 'siteName', name: 'Site Name', sortOrder: 18 },
  archive: { id: 'archive', name: null, sortOrder: 52 },
  postHireStatuses: { id: 'postHireStatuses', name: 'Graduated', sortOrder: 20, sortable: false },
  edit: { id: 'edit', name: null, sortOrder: 51 },
  rosStartDate: { id: 'rosStartDate', name: 'Return of Service Start Date', sortOrder: 22 },
  rosSiteName: { id: 'rosSiteName', name: 'RoS Site Name', sortOrder: 23 },
  employerName: { id: 'employerName', name: 'Hired By', sortOrder: 24 },
  lastEngagedBy: { id: 'lastEngagedBy', name: 'Last Engaged By', sortOrder: 16 },
  lastEngagedDate: { id: 'lastEngagedDate', name: 'Last Engaged Date', sortOrder: 17 },
  archiveReason: { id: 'archiveReason', name: 'Archive Reason', sortOrder: 25, sortable: false },
};

const {
  id,
  lastName,
  firstName,
  status,
  mohStatus,
  postalCodeFsa,
  phoneNumber,
  emailAddress,
  preferredLocation,
  distance,
  interested,
  nonHCAP,
  crcClear,
  userUpdatedAt,
  engage,
  edit,
  siteName,
  archive,
  postHireStatuses,
  rosStartDate,
  rosSiteName,
  employerName,
  lastEngagedBy,
  lastEngagedDate,
  archiveReason,
} = columns;

export const columnsByRole = {
  superuser: {
    Participants: [
      id,
      lastName,
      firstName,
      mohStatus,
      postalCodeFsa,
      phoneNumber,
      emailAddress,
      preferredLocation,
      distance,
      interested,
      nonHCAP,
      crcClear,
      userUpdatedAt,
      postHireStatuses,
      rosStartDate,
      edit,
    ],
  },

  ministry_of_health: {
    Participants: [
      id,
      lastName,
      firstName,
      mohStatus,
      postalCodeFsa,
      preferredLocation,
      interested,
      nonHCAP,
      crcClear,
      userUpdatedAt,
      postHireStatuses,
      rosStartDate,
      edit,
    ],
  },

  health_authority: {
    'Available Participants': [
      id,
      lastName,
      firstName,
      postalCodeFsa,
      phoneNumber,
      emailAddress,
      preferredLocation,
      distance,
      userUpdatedAt,
      engage,
    ],
    'My Candidates': [
      id,
      lastName,
      firstName,
      status,
      postalCodeFsa,
      phoneNumber,
      emailAddress,
      preferredLocation,
      distance,
      userUpdatedAt,
      engage,
      siteName,
      lastEngagedBy,
      lastEngagedDate,
    ],
    'Archived Candidates': [
      id,
      lastName,
      firstName,
      status,
      postalCodeFsa,
      preferredLocation,
      distance,
      nonHCAP,
      userUpdatedAt,
      siteName,
      archiveReason,
      engage,
    ],
    'Hired Candidates': [
      id,
      lastName,
      firstName,
      status,
      phoneNumber,
      emailAddress,
      siteName,
      nonHCAP,
      userUpdatedAt,
      postHireStatuses,
      employerName,
      archive,
    ],
    'Return Of Service': [
      id,
      lastName,
      firstName,
      phoneNumber,
      emailAddress,
      status,
      rosStartDate,
      rosSiteName,
      employerName,
      archive,
    ],
  },

  employer: {
    'Available Participants': [
      id,
      lastName,
      firstName,
      postalCodeFsa,
      phoneNumber,
      emailAddress,
      preferredLocation,
      distance,
      userUpdatedAt,
      engage,
    ],
    'My Candidates': [
      id,
      lastName,
      firstName,
      status,
      postalCodeFsa,
      phoneNumber,
      emailAddress,
      preferredLocation,
      distance,
      userUpdatedAt,
      engage,
      siteName,
      lastEngagedBy,
      lastEngagedDate,
    ],
    'Archived Candidates': [
      id,
      lastName,
      firstName,
      status,
      postalCodeFsa,
      preferredLocation,
      distance,
      nonHCAP,
      userUpdatedAt,
      siteName,
      archiveReason,
      engage,
    ],
    'Hired Candidates': [
      id,
      lastName,
      firstName,
      status,
      phoneNumber,
      emailAddress,
      siteName,
      nonHCAP,
      userUpdatedAt,
      postHireStatuses,
      employerName,
      archive,
    ],
    'Return Of Service': [
      id,
      lastName,
      firstName,
      phoneNumber,
      emailAddress,
      status,
      rosStartDate,
      rosSiteName,
      employerName,
      archive,
    ],
  },
};
