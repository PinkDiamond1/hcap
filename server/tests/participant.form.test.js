/* eslint-disable no-restricted-syntax, no-await-in-loop */
const { readFileSync } = require('fs');
const { join } = require('path');
const { ValidationError } = require('yup');
const { v4 } = require('uuid');
const { startDB, closeDB } = require('./util/db');
const {
  parseAndSaveParticipants,
  getParticipants,
  setParticipantStatus,
  makeParticipant,
} = require('../services/participants.js');
const { getReport } = require('../services/reporting.js');
const { evaluateBooleanAnswer } = require('../validation');

describe('Participants Service', () => {
  beforeAll(async () => {
    await startDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  const regions = [
    'Fraser',
    'Interior',
    'Northern',
    'Vancouver Coastal',
    'Vancouver Island',
  ];

  const allParticipants = [
    {
      nonHCAP: 'yes',
      crcClear: 'yes',
      lastName: 'Alex',
      firstName: 'Alliteration',
      maximusId: 6488690,
      interested: 'yes',
      postalCode: 'V1V2V3',
      phoneNumber: '2502223333',
      emailAddress: 'alli@example.com',
      postalCodeFsa: 'V1V',
      preferredLocation: 'Fraser',
    },
    {
      crcClear: 'yes',
      lastName: 'Bob',
      firstName: 'Burger',
      maximusId: 6488691,
      interested: 'yes',
      postalCode: 'X1X1X1',
      phoneNumber: '7781234567',
      emailAddress: 'bob.burger@test.com',
      postalCodeFsa: 'X1X',
      preferredLocation: 'Interior',
    },
    {
      crcClear: 'yes',
      lastName: 'Cindy',
      firstName: 'Callback',
      maximusId: 6488692,
      postalCode: 'X2X2X2',
      phoneNumber: '7780987654',
      emailAddress: 'cindy@example.ca',
      postalCodeFsa: 'X2X',
      preferredLocation: 'Northern',
    },
    {
      lastName: 'Doug',
      firstName: 'Douglas',
      maximusId: 6488693,
      interested: 'yes',
      postalCode: 'C9C8C7',
      phoneNumber: '6051234567',
      emailAddress: 'doug@test.bc.gov',
      postalCodeFsa: 'C9C',
      preferredLocation: 'Vancouver Coastal;Vancouver Island',
    },
    {
      nonHCAP: 'yes',
      crcClear: 'no',
      lastName: 'Emily',
      firstName: 'Everready',
      maximusId: 6488694,
      interested: 'yes',
      postalCode: 'C9C8C7',
      phoneNumber: '6050987654',
      emailAddress: 'em1990@test.ca',
      postalCodeFsa: 'C9C',
      preferredLocation: 'Vancouver Island',
    },
    {
      lastName: 'Freddy',
      firstName: 'Foo',
      maximusId: 6488695,
      interested: 'yes',
      postalCode: 'V1V2V3',
      phoneNumber: '2501112222',
      emailAddress: 'foo@test.com',
      postalCodeFsa: 'V1V',
      preferredLocation: 'Vancouver Island',
    },
    {
      nonHCAP: 'yes',
      crcClear: 'yes',
      lastName: 'Gemma',
      firstName: 'Gusto',
      maximusId: 6488696,
      interested: 'yes',
      postalCode: 'X1X1X1',
      phoneNumber: '7781112222',
      emailAddress: 'gem@gemma.gusto.ca',
      postalCodeFsa: 'X1X',
      preferredLocation: 'Vancouver Coastal',
    },
    {
      nonHCAP: 'no',
      crcClear: 'yes',
      lastName: 'Jerry',
      firstName: 'Jenkins',
      maximusId: 6488699,
      interested: 'no',
      postalCode: 'X1X1X1',
      phoneNumber: '7784445555',
      emailAddress: 'jj@test.com',
      postalCodeFsa: 'X1X',
      preferredLocation: 'Northern',
    },
    {
      lastName: 'Isabelle',
      firstName: 'Isaac',
      maximusId: 6488698,
      postalCode: 'Z0Z0Z0',
      phoneNumber: '7783334444',
      emailAddress: 'isa@example.com',
      postalCodeFsa: 'Z0Z',
      preferredLocation: 'Interior',
    },
    {
      crcClear: 'yes',
      lastName: 'Hector',
      firstName: 'Hux',
      maximusId: 6488697,
      interested: 'yes',
      postalCode: 'Z0Z0Z0',
      phoneNumber: '7782223333',
      emailAddress: 'hux123@example.com',
      postalCodeFsa: 'Z0Z',
      preferredLocation: 'Fraser;Vancouver Coastal',
    },
  ];

  it('Parse participants xlsx, receive success', async () => {
    const file = readFileSync(join(__dirname, './mock/xlsx/participants-data.xlsx'));
    const res = await parseAndSaveParticipants(file);

    const expectedRes = [
      { id: 6488690, status: 'Success' },
      { id: 6488691, status: 'Success' },
      { id: 6488692, status: 'Success' },
      { id: 6488693, status: 'Success' },
      { id: 6488694, status: 'Success' },
      { id: 6488695, status: 'Success' },
      { id: 6488696, status: 'Success' },
      { id: 6488697, status: 'Success' },
      { id: 6488698, status: 'Success' },
      { id: 6488699, status: 'Success' },
    ];

    expect(res).toEqual(expectedRes);
  });

  it('Parse participants xlsx, receive duplicate errors', async () => {
    const file = readFileSync(join(__dirname, './mock/xlsx/participants-data.xlsx'));
    const res = await parseAndSaveParticipants(file);

    const expectedRes = [
      { id: 6488690, status: 'Duplicate' },
      { id: 6488691, status: 'Duplicate' },
      { id: 6488692, status: 'Duplicate' },
      { id: 6488693, status: 'Duplicate' },
      { id: 6488694, status: 'Duplicate' },
      { id: 6488695, status: 'Duplicate' },
      { id: 6488696, status: 'Duplicate' },
      { id: 6488697, status: 'Duplicate' },
      { id: 6488698, status: 'Duplicate' },
      { id: 6488699, status: 'Duplicate' },
    ];

    expect(res).toEqual(expectedRes);
  });

  it('Parse participants xlsx, receive validation error', async () => {
    const file = readFileSync(join(__dirname, './mock/xlsx/participants-data-error.xlsx'));
    expect(parseAndSaveParticipants(file)).rejects.toEqual(new ValidationError('Please specify a preferred (EOI) location for participant of row 2'));
  });

  it('Get participants as super_user, receive all successfully', async () => {
    const res = await getParticipants({ isSuperUser: true });

    expect(res.data).toEqual(
      expect.arrayContaining(
        allParticipants.map((item) => (expect.objectContaining(item))),
      ),
    );
  });

  it('Set participant status with different employers, fetch participant with status', async () => {
    const employerAId = v4();
    const employerBId = v4();

    const openParticipants = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['open']);

    await setParticipantStatus(employerAId, openParticipants.data[0].id, 'prospecting');
    await setParticipantStatus(employerAId, openParticipants.data[0].id, 'interviewing');
    await setParticipantStatus(employerAId, openParticipants.data[0].id, 'offer_made');

    await setParticipantStatus(employerBId, openParticipants.data[0].id, 'prospecting');

    const participantsA = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['offer_made']);
    expect(participantsA.data[0].statusInfos[0].employerId).toEqual(employerAId);

    const participantsB = await getParticipants({ isEmployer: true, id: employerBId, regions }, null, null, null, null, null, null, ['prospecting']);
    expect(participantsB.data[0].statusInfos[0].employerId).toEqual(employerBId);
  });

  it('Get participants as MoH, receive successfully', async () => {
    const res = await getParticipants({
      isMoH: true,
    });

    expect(res.data.map((item) => (Object.keys(item)))).toEqual(
      allParticipants.map(() => ([
        'id',
        'firstName',
        'lastName',
        'postalCodeFsa',
        'preferredLocation',
        'nonHCAP',
        'interested',
        'crcClear',
        'statusInfo',
        'progressStats',
      ])),
    );
  });

  it('Get participants as HA, receive successfully', async () => {
    const res = await getParticipants({
      isMoH: false,
      isSuperUser: false,
      regions,
    });

    const filteredParticipants = allParticipants
      .filter((item) => (
        evaluateBooleanAnswer(item.interested)
        && evaluateBooleanAnswer(item.crcClear)));

    expect(res.data.map((item) => (Object.keys(item)))).toEqual(
      filteredParticipants.map(() => ([
        'id',
        'firstName',
        'lastName',
        'postalCodeFsa',
        'preferredLocation',
        'nonHCAP',
      ])),
    );
  });

  it('Status change happy path', async () => {
    const employerAId = v4();
    const participants = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['open']);
    const participantId = participants.data[0].id;

    // Engage, reject
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'rejected', { final_status: 'not responsive', previous: 'prospecting' })).status).toEqual('rejected');

    // Engage, withdraw
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'rejected', { final_status: 'withdrawn', previous: 'prospecting' })).status).toEqual('rejected');

    // Re-engage, interview, reject
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('interviewing');
    expect((await setParticipantStatus(employerAId, participantId, 'rejected', { final_status: 'not qualified', previous: 'interviewing' })).status).toEqual('rejected');

    // Re-engage. offer made, reject
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('interviewing');
    expect((await setParticipantStatus(employerAId, participantId, 'offer_made')).status).toEqual('offer_made');
    expect((await setParticipantStatus(employerAId, participantId, 'rejected', { final_status: 'position filled', previous: 'offer_made' })).status).toEqual('rejected');

    // Re-engage, hire
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('interviewing');
    expect((await setParticipantStatus(employerAId, participantId, 'offer_made')).status).toEqual('offer_made');
    expect((await setParticipantStatus(employerAId, participantId, 'hired')).status).toEqual('hired');
  });

  it('Employer A hires participant X then employer B cannot hire participant X', async () => {
    const employerAId = v4();
    const employerBId = v4();

    const participants = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['open']);

    const hiredParticipantId = participants.data[0].id;

    await setParticipantStatus(employerAId, hiredParticipantId, 'prospecting');
    await setParticipantStatus(employerAId, hiredParticipantId, 'interviewing');
    await setParticipantStatus(employerAId, hiredParticipantId, 'offer_made');
    await setParticipantStatus(employerAId, hiredParticipantId, 'hired');

    const result = await setParticipantStatus(employerBId, hiredParticipantId, 'hired');

    expect(result.status).toEqual('already_hired');
  });

  it('Status change does not follow transitions: open > prospecting > interviewing > offer_made > hired, receive invalid_status_transition', async () => {
    const employerAId = v4();

    const participants = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['open']);

    const participantId = participants.data[0].id;

    // Cannot skip a status
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'offer_made')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'hired')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('invalid_status_transition');

    // Cannot go backwards
    await setParticipantStatus(employerAId, participantId, 'prospecting');
    expect((await setParticipantStatus(employerAId, participantId, 'open')).status).toEqual('invalid_status_transition');
    await setParticipantStatus(employerAId, participantId, 'interviewing');
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'open')).status).toEqual('invalid_status_transition');
    await setParticipantStatus(employerAId, participantId, 'offer_made');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('invalid_status_transition');
    expect((await setParticipantStatus(employerAId, participantId, 'open')).status).toEqual('invalid_status_transition');

    // Cannot hire and re-engage
    await setParticipantStatus(employerAId, participantId, 'hired');
    expect((await setParticipantStatus(employerAId, participantId, 'open')).status).toEqual('already_hired');
    expect((await setParticipantStatus(employerAId, participantId, 'prospecting')).status).toEqual('already_hired');
    expect((await setParticipantStatus(employerAId, participantId, 'interviewing')).status).toEqual('already_hired');
    expect((await setParticipantStatus(employerAId, participantId, 'offer_made')).status).toEqual('already_hired');
    expect((await setParticipantStatus(employerAId, participantId, 'hired')).status).toEqual('already_hired');
  });

  it('Two Employers engage one participant and the inProgress number increases by one', async () => {
    const employerAId = v4();
    const employerBId = v4();

    const participants = await getParticipants({ isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['open']);

    const selectParticipantId = participants.data[0].id;

    const firstReport = await getReport();

    await setParticipantStatus(employerAId, selectParticipantId, 'prospecting');
    await setParticipantStatus(employerBId, selectParticipantId, 'prospecting');

    const secondReport = await getReport();

    expect(secondReport.inProgress).toEqual(firstReport.inProgress + 1);
  });

  it('See unavailable participant, acknowledge as rejected, then receive 0 unavailable participants', async () => {
    const employerAId = v4();
    const employerBId = v4();

    const participantsB = await getParticipants({ isEmployer: true, id: employerBId, regions }, null, null, null, null, null, null, ['open']);

    const selectParticipantId = participantsB.data[0].id;

    await setParticipantStatus(employerAId, selectParticipantId, 'prospecting');
    await setParticipantStatus(employerBId, selectParticipantId, 'prospecting');
    await setParticipantStatus(employerBId, selectParticipantId, 'interviewing');
    await setParticipantStatus(employerBId, selectParticipantId, 'offer_made');
    await setParticipantStatus(employerBId, selectParticipantId, 'hired');

    const unavailableParticipantsA = await getParticipants(
      { isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['prospecting', 'interviewing', 'offer_made', 'unavailable'],
    );

    expect(unavailableParticipantsA.data[0].statusInfos[0].status).toEqual('prospecting');
    expect(unavailableParticipantsA.data[0].statusInfos[1].status).toEqual('already_hired');

    await setParticipantStatus(employerAId, selectParticipantId, 'rejected', { final_status: 'hired by other', previous: 'prospecting' });

    const rejectedParticipantsA = await getParticipants(
      { isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['rejected'],
    );

    expect(rejectedParticipantsA.data[0].statusInfos[0].status).toEqual('rejected');
    expect(rejectedParticipantsA.data[0].statusInfos[0].data.final_status).toEqual('hired by other');
    expect(rejectedParticipantsA.data[0].statusInfos[0].data.previous).toEqual('prospecting');
    expect(rejectedParticipantsA.data[0].statusInfos[1].status).toEqual('already_hired');

    const unavailableParticipantsAafter = await getParticipants(
      { isEmployer: true, id: employerAId, regions }, null, null, null, null, null, null, ['prospecting', 'interviewing', 'offer_made', 'unavailable'],
    );

    expect(unavailableParticipantsAafter.data.length).toEqual(0);
  });

  it('Checks MoH status versus multiple employer engagement', async () => {
    await closeDB();
    await startDB();
    const employerAId = v4();
    const employerBId = v4();

    const participant1 = {
      maximusId: 648690,
      lastName: 'Extra',
      firstName: 'Eddy',
      postalCode: 'V1V2V3',
      postalCodeFsa: 'V1V',
      phoneNumber: '2502223333',
      emailAddress: 'eddy@example.com',
      interested: 'yes',
      nonHCAP: 'yes',
      crcClear: 'yes',
      preferredLocation: 'Fraser',
    };

    const participant2 = {
      maximusId: 648691,
      lastName: 'Extra',
      firstName: 'Eduardo',
      postalCode: 'V1V2V3',
      postalCodeFsa: 'V1V',
      phoneNumber: '2502223333',
      emailAddress: 'eddy@example.com',
      interested: 'yes',
      nonHCAP: 'yes',
      crcClear: 'no',
      preferredLocation: 'Fraser',
    };

    await makeParticipant(participant1);
    await makeParticipant(participant2);

    let participants = await getParticipants({ isMoH: true });
    expect(participants.data[0].statusInfo).toEqual('Available');
    expect(participants.data[1].statusInfo).toEqual('Pending');

    await setParticipantStatus(employerAId, participants.data[0].id, 'prospecting');

    participants = await getParticipants({ isMoH: true });
    expect(participants.data[0].statusInfo).toEqual('In Progress');

    await setParticipantStatus(employerBId, participants.data[0].id, 'prospecting');
    await setParticipantStatus(employerBId, participants.data[0].id, 'interviewing');
    await setParticipantStatus(employerBId, participants.data[0].id, 'offer_made');

    participants = await getParticipants({ isMoH: true });
    expect(participants.data[0].statusInfo).toEqual('In Progress (2)');

    await setParticipantStatus(employerBId, participants.data[0].id, 'hired');

    participants = await getParticipants({ isMoH: true });
    expect(participants.data[0].statusInfo).toEqual('Hired');
  });
});
