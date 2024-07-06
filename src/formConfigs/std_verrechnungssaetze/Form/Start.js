import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Stack } from '@mui/material';
import dayjs from 'dayjs';

// formik
import { useFormikContext } from 'formik';
import FormSection from 'components/formComponents/FormSection/index';
import { UserContext } from 'context/user/index';
import FormReadonlyValue from 'components/formComponents/FormReadonlyValue/index';

const Annahmen = () => {
  const { values } = useFormikContext();

  return (
    <>
      <FormSection collapsable={false}>
        <Stack justifyContent="space-between" alignItems="center" direction="row" sx={{ width: '100%' }}>
          {/* <DateTimePicker readOnly label="Letzte Änderung" value={dayjs(values.letzteAenderung)} /> */}
          <FormReadonlyValue label="Letzte Änderung" value={dayjs(values.letzteAenderung).format('DD.MM.YYYY')} />
        </Stack>
      </FormSection>
    </>
  );
};

export default Annahmen;
