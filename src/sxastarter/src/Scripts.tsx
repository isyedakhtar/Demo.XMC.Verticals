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
      <LoanFormSubmitHelper formId="df417f3c755a4db784ec507ea5f5daa1-aue" />
    </>
  );
};

export default Scripts;
