import React, { useMemo, useState, useEffect } from 'react';
import {
  InterviewingFormSchema,
  ChangeRosSiteSchema,
  RejectedFormSchema,
  ProspectingSiteSchema,
  participantStatus,
  ToastStatus,
} from '../../constants';
import { Dialog } from '../../components/generic';
import {
  ProspectingForm,
  InterviewingForm,
  RejectedForm,
  HireForm,
  NewParticipantForm,
  EditParticipantForm,
  ArchiveHiredParticipantForm,
  ReturnOfServiceForm,
  SelectProspectingSiteForm,
  ChangeSiteForm,
} from '../../components/modal-forms';
import { getDialogTitle } from '../../utils';
import { AuthContext, ParticipantsContext } from '../../providers';
import { createReturnOfServiceStatus, getAllSites } from '../../services';
import { useToast } from '../../hooks';

export const ParticipantTableDialogues = ({
  fetchParticipants,
  activeModalForm,
  actionMenuParticipant,
  bulkParticipants,
  onClose,
  handleEngage,
  handleUpdate,
}) => {
  const { dispatch: participantsDispatch } = ParticipantsContext.useParticipantsContext();
  const { auth } = AuthContext.useAuth();
  const sites = useMemo(() => auth.user?.sites || [], [auth.user?.sites]);
  const { openToast } = useToast();
  const [allSites, setAllSites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getParticipantName = (participant) => {
    return participant ? `${participant?.firstName} ${participant?.lastName}` : '';
  };

  const handleSingleSelectProspectingSites = (values) => {
    handleEngage(actionMenuParticipant.id, participantStatus.PROSPECTING, {
      sites: [values.prospectingSite],
    });
  };

  const handleMultiSelectProspectingSites = (values) => {
    bulkParticipants.forEach((participant) => {
      handleEngage(participant?.id, participantStatus.PROSPECTING, {
        sites: [values.prospectingSite],
      });
    });
  };

  const handleChangeSite = async (values) => {
    try {
      if (!isLoading) {
        setIsLoading(true);
        const { employmentType, healthAuthority, positionType, site, startDate } = values;
        await createReturnOfServiceStatus({
          participantId: actionMenuParticipant.id,
          newSiteId: site,
          data: {
            startDate,
            employmentType,
            positionType,
            healthAuthority,
            sameSite: false,
          },
          isUpdating: true,
        });
        handleUpdate(true, 'Return of Service site updated!');
      }
    } catch (error) {
      handleUpdate(false, error.message);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const fetchAllSites = async () => {
    try {
      const { data = [] } = await getAllSites();
      setAllSites(data);
    } catch (err) {
      openToast({
        status: ToastStatus.Error,
        message: err.message,
      });
    }
  };

  useEffect(() => {
    if (allSites.length === 0) {
      fetchAllSites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      title={getDialogTitle(activeModalForm)}
      open={activeModalForm != null}
      onClose={onClose}
      showDivider
    >
      {activeModalForm === 'single-select-site' && (
        <SelectProspectingSiteForm
          initialValues={{ prospectingSite: undefined }}
          validationSchema={ProspectingSiteSchema}
          onSubmit={(values) => {
            handleSingleSelectProspectingSites(values);
          }}
          onClose={onClose}
        />
      )}

      {activeModalForm === 'multi-select-site' && (
        <SelectProspectingSiteForm
          isMultiSelect
          selected={bulkParticipants}
          initialValues={{ prospectingSite: undefined }}
          validationSchema={ProspectingSiteSchema}
          onSubmit={(values) => {
            handleMultiSelectProspectingSites(values);
          }}
          onClose={onClose}
        />
      )}

      {activeModalForm === 'prospecting' && (
        <ProspectingForm
          name={getParticipantName(actionMenuParticipant || bulkParticipants[0])}
          participantsCount={
            !actionMenuParticipant && bulkParticipants?.length > 0 ? bulkParticipants.length : -1
          }
          onClose={() => {
            fetchParticipants();
            onClose();
          }}
          onSubmit={async () => {
            onClose();

            participantsDispatch({
              type: ParticipantsContext.types.SELECT_TAB,
              payload: 'My Candidates',
            });
          }}
        />
      )}

      {activeModalForm === 'interviewing' && (
        <InterviewingForm
          initialValues={{ contactedDate: '' }}
          validationSchema={InterviewingFormSchema}
          onSubmit={(values) => {
            handleEngage(actionMenuParticipant.id, 'interviewing', {
              contacted_at: values.contactedDate,
            });
          }}
          onClose={onClose}
        />
      )}

      {activeModalForm === 'rejected' && (
        <RejectedForm
          initialValues={{ contactedDate: '' }}
          validationSchema={RejectedFormSchema}
          onSubmit={(values) => {
            handleEngage(actionMenuParticipant.id, 'rejected', {
              final_status: values.finalStatus,
            });
          }}
          onClose={onClose}
        />
      )}

      {activeModalForm === 'hired' && (
        <HireForm
          sites={sites}
          onSubmit={(values) => {
            handleEngage(actionMenuParticipant.id, 'hired', {
              nonHcapOpportunity: values.nonHcapOpportunity,
              positionTitle: values.positionTitle,
              positionType: values.positionType,
              hiredDate: values.hiredDate,
              startDate: values.startDate,
              site: values.site,
            });
          }}
          onClose={onClose}
        />
      )}
      {activeModalForm === 'edit-participant' && (
        <EditParticipantForm
          initialValues={actionMenuParticipant}
          onClose={onClose}
          submissionCallback={fetchParticipants}
        />
      )}
      {activeModalForm === 'new-participant' && (
        <NewParticipantForm
          sites={sites}
          onClose={onClose}
          submissionCallback={fetchParticipants}
        />
      )}
      {activeModalForm === 'archive' && (
        <ArchiveHiredParticipantForm
          onSubmit={(values) => {
            handleEngage(actionMenuParticipant.id, 'archived', values);
          }}
          onClose={onClose}
          participant={actionMenuParticipant}
        />
      )}
      {activeModalForm === 'return-of-service' && (
        <ReturnOfServiceForm
          participantId={actionMenuParticipant.id}
          onClose={onClose}
          completionHandler={handleUpdate}
        />
      )}

      {activeModalForm === 'change-site' && (
        <ChangeSiteForm
          initialValues={{
            startDate: undefined,
            positionType: undefined,
            employmentType: undefined,
            site: undefined,
            healthAuthority: undefined,
          }}
          sites={allSites}
          validationSchema={ChangeRosSiteSchema}
          onSubmit={(values) => {
            handleChangeSite(values);
          }}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};
