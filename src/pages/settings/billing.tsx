import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const Billing: NextPageWithLayout = () => {
  return <p>Billing page</p>;
};

Billing.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Billing;
