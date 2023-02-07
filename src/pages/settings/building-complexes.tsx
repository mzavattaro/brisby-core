import SettingsLayout from "../../components/SettingsLayout";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";

const BuildingComplexes: NextPageWithLayout = () => {
  return <p>Buildings page</p>;
};

BuildingComplexes.getLayout = function getLayout(page: ReactElement) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default BuildingComplexes;
