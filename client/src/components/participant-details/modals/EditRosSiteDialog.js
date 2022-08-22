import React, { useEffect, useState } from 'react';

import { EditRosSiteSchema, ToastStatus } from '../../../constants';
import { useToast } from '../../../hooks';
import { getAllSites } from '../../../services';
import { Dialog } from '../../generic';
import { EditRosSite } from '../../modal-forms';

export const EditRosSiteDialog = ({ isOpen, onClose, onSubmit }) => {
  const [allSites, setAllSites] = useState([]);
  const { openToast } = useToast();

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
  });

  return (
    <Dialog title='Edit RoS Current Site' open={isOpen}>
      <EditRosSite
        initialValues={{ siteName: undefined }}
        validationSchema={EditRosSiteSchema}
        onSubmit={onSubmit}
        onClose={onClose}
        sites={allSites}
      />
    </Dialog>
  );
};
