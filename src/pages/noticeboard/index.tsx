import { type NextPage } from "next";
import GridLayout from "../../components/GridLayout";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import ToolBar from "../../components/ToolBar";

const Noticeboard: NextPage = () => {
  return (
    <div className="text-gray-900">
      <div>
        {/* <div className="relative">
          <Modal />
        </div> */}
        <Header />
        <GridLayout />
        <ToolBar />
      </div>
    </div>
  );
};

export default Noticeboard;
