import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const Notices: NextPageWithLayout = () => {
  return <p>Notices page</p>;
};

Notices.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Notices;
