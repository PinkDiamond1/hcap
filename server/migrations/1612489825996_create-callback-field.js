/* eslint-disable max-len */
const { dbClient, collections } = require('../db');

exports.up = async () => {
  const inList = [
    212364,
    212365,
    212367,
    212368,
    212370,
    212371,
    212373,
    212374,
    212375,
    212376,
    212378,
    212382,
    212383,
    212384,
    212385,
    212386,
    212388,
    212390,
    212392,
    212394,
    212395,
    212396,
    212397,
    212399,
    212400,
    212402,
    212403,
    212405,
    212406,
    212407,
    212409,
    212410,
    212411,
    212412,
    212413,
    212414,
    212416,
    212418,
    212421,
    212422,
    212425,
    212430,
    212431,
    212433,
    212434,
    212437,
    212438,
    212440,
    212445,
    212446,
    212447,
    212448,
    212450,
    212451,
    212452,
    212453,
    212460,
    212461,
    212462,
    212465,
    212467,
    212468,
    212469,
    212471,
    212472,
    212473,
    212474,
    212476,
    212480,
    212482,
    212483,
    212484,
    212485,
    212486,
    212487,
    212488,
    212489,
    212490,
    212493,
    212494,
    212495,
    212496,
    212497,
    212499,
    212501,
    212502,
    212503,
    212504,
    212505,
    212509,
    212512,
    212514,
    212515,
    212516,
    212517,
    212520,
    212522,
    212524,
    212525,
    212526,
    212527,
    212529,
    212530,
    212534,
    212535,
    212536,
    212537,
    212538,
    212539,
    212541,
    212543,
    212544,
    212546,
    212547,
    212548,
    212550,
    212552,
    212553,
    212555,
    212556,
    212557,
    212559,
    212561,
    212562,
    212564,
    212565,
    212566,
    212568,
    212571,
    212573,
    212575,
    212578,
    212580,
    212584,
    212585,
    212588,
    212590,
    212592,
    212595,
    212600,
    212603,
    212604,
    212605,
    212606,
    212607,
    212608,
    212609,
    212610,
    212611,
    212614,
    212615,
    212616,
    212617,
    212618,
    212619,
    212620,
    212621,
    212623,
    212624,
    212625,
    212626,
    212627,
    212628,
    212632,
    212633,
    212634,
    212636,
    212637,
    212638,
    212639,
    212641,
    212642,
    212643,
    212644,
    212646,
    212649,
    212651,
    212652,
    212655,
    212658,
    212659,
    212661,
    212663,
    212665,
    212667,
    212670,
    212671,
    212676,
    212678,
    212679,
    212680,
    212681,
    212682,
    212683,
    212685,
    212687,
    212688,
    212691,
    212693,
    212694,
    212695,
    212696,
    212697,
    212698,
    212699,
    212700,
    212702,
    212703,
    212704,
    212705,
    212706,
    212707,
    212708,
    212709,
    212710,
    212711,
    212714,
    212715,
    212717,
    212718,
    212719,
    212722,
    212724,
    212726,
    212727,
    212729,
    212730,
    212731,
    212734,
    212737,
    212738,
    212739,
    212740,
    212744,
    212745,
    212748,
    212749,
    212752,
    212753,
    212754,
    212755,
    212756,
    212758,
    212759,
    212761,
    212764,
    212771,
    212772,
    212774,
    212775,
    212776,
    212777,
    212781,
    212784,
    212785,
    212787,
    212788,
    212789,
    212795,
    212799,
    212800,
    212802,
    212803,
    212804,
    212805,
    212806,
    212809,
    212810,
    212813,
    212814,
    212816,
    212817,
    212818,
    212820,
    212821,
    212822,
    212823,
    212824,
    212825,
    212826,
    212827,
    212830,
    212831,
    212832,
    212833,
    212834,
    212835,
    212839,
    212840,
    212841,
    212842,
    212843,
    212846,
    212847,
    212848,
    212850,
    212851,
    212853,
    212854,
    212857,
    212860,
    212861,
    212865,
    212866,
    212867,
    212868,
    212870,
    212876,
    212878,
    212879,
    212881,
    212885,
    212886,
    212888,
    212889,
    212891,
    212892,
    212894,
    212896,
    212897,
    212898,
    212899,
    212900,
    212902,
    212903,
    212905,
    212906,
    212907,
    212908,
    212910,
    212911,
    212912,
    212913,
    212916,
    212919,
    212920,
    212922,
    212923,
    212924,
    212925,
    212926,
    212927,
    212928,
    212931,
    212932,
    212935,
    212937,
    212938,
    212939,
    212940,
    212943,
    212944,
    212947,
    212949,
    212950,
    212952,
    212953,
    212954,
    212958,
    212959,
    212960,
    212961,
    212963,
    212964,
    212970,
    212971,
    212972,
    212974,
    212976,
    212977,
    212978,
    212979,
    212980,
    212982,
    212983,
    212984,
    212985,
    212986,
    212987,
    212988,
    212991,
    212994,
    212997,
    212998,
    212999,
    213001,
    213004,
    213005,
    213007,
    213008,
    213009,
    213010,
    213013,
    213014,
    213016,
    213017,
    213018,
    213022,
    213023,
    213025,
    213027,
    213033,
    213035,
    213036,
    213037,
    213038,
    213041,
  ];

  await dbClient.db.withTransaction(async (tx) => {
    await tx.query(
      `ALTER TABLE ${collections.PARTICIPANTS} DISABLE TRIGGER public_participants_updated`
    );

    await tx.query('UPDATE participants SET updated_at=created_at WHERE updated_at IS NULL');

    await tx.query(
      "UPDATE participants SET body=jsonb_set(body, '{userUpdatedAt}', ('\"' || (updated_at::TEXT) || '\"')::JSONB)"
    );

    await tx.query(
      `ALTER TABLE ${collections.PARTICIPANTS} ENABLE TRIGGER public_participants_updated`
    );

    await tx[collections.PARTICIPANTS].updateDoc({}, { callbackStatus: false });

    await tx[collections.PARTICIPANTS].updateDoc(
      { 'created_at <': '2021-01-01' },
      { callbackStatus: true },
      { body: 'body' } // Forces MassiveJS to query as non-document table https://massivejs.org/docs/working-with-documents#updatedoc
    );

    await tx[collections.PARTICIPANTS].updateDoc(
      {
        'maximusId::int': inList,
      },
      { callbackStatus: true }
    );
  });
};
