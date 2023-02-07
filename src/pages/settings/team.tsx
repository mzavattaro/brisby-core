import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const Team: NextPageWithLayout = () => {
  return <p>Team page</p>;
};

Team.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Team;
