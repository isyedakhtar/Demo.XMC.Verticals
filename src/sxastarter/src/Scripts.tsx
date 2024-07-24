// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import CdpPageView from 'components/CdpPageView';
import FEAASScripts from 'components/FEAASScripts';
import LoanFormSubmitHelper from 'components/LoanFormSubmitHelper';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <CdpPageView />
      <FEAASScripts />
      {/* <LoanFormSubmitHelper formId="df417f3c755a4db784ec507ea5f5daa1-aue" />
      <LoanFormSubmitHelper formId="877ef7eb68db42b8b491ede9ca71f2f8-aue" /> */}
      <LoanFormSubmitHelper formId="bdc38a75b9124b648a84c3016493e05e-aue" />
      <LoanFormSubmitHelper formId="05bcf137d8eb4b89a6b71aef2b844b59-aue" />
    </>
  );
};

export default Scripts;
