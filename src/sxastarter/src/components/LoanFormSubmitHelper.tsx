/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import $ from 'jquery';
import { CdpIdentityEvent } from './CdpIdentityEvent';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'src/temp/config';
interface DynamicFormListenerProps {
  formId: string;
}

const LoanFormSubmitHelper = ({ formId }: DynamicFormListenerProps) => {
  const {
    sitecoreContext: { route },
  } = useSitecoreContext();
  useEffect(() => {
    $(document).ready(() => {
      setTimeout(() => {
        const $submitButton = $(`.submit-button`);
        if (!$submitButton) {
          console.log('submit button was nto found');
          return;
        }
        const handleSubmit = () => {
          const forms = $(`form[data-formid=${formId}]`);
          if (!forms || !forms[0]) return;
          const inputs = Array.from(forms[0].getElementsByTagName('input'));
          const email = inputs.find((i) => {
            return i.name === 'text_email';
          });
          const fullName = inputs.find((i) => {
            return i.name === 'text_name';
          });

          const [firstName, lastName] = fullName?.value?.split(' ') ?? [];

          const idNumber = inputs.find((i) => {
            return i.name === 'text_idnumber';
          });

          const phone = inputs.find((i) => {
            return i.name === 'text_phone';
          });

          if (!email || !email.value) return;
          const inputValues: { [key: string]: string } = {};
          inputs.map((i) => {
            return (inputValues[i.name] = i.value);
          });

          const identityParams = {
            Email: email.value,
            firstName: firstName,
            lastName: lastName,
            IdNumber: idNumber?.value ?? '',
            Mobile: phone?.value ?? '',
            Language: route?.itemLanguage || config.defaultLanguage,
          };
          CdpIdentityEvent({
            identityParams: identityParams,
          });
        };

        $submitButton.on('click', handleSubmit);
        return () => {
          $submitButton.off('submit', handleSubmit);
        };
      }, 1000);
    });
  }, [formId, route?.itemLanguage]);

  return null;
};

export default LoanFormSubmitHelper;
