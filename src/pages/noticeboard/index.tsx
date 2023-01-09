import { type NextPage } from "next";
import ToolBar from "../../components/ToolBar";
import ColumnLayout from "../../components/ColumnLayout";
import Header from "../../components/Header";
import StackedList from "../../components/StackedList";
import communityNotices from "../../data/communityNotice";
import Modal from "../../components/Modal";

const Noticeboard: NextPage = () => {
  return (
    <div className="text-gray-900">
      <div>
        {/* <div className="relative">
          <Modal />
        </div> */}
        <Header />
        <ToolBar />
        {/* <ColumnLayout>
          <StackedList communityNotices={communityNotices} />
        </ColumnLayout> */}
      </div>
    </div>
  );
};

export default Noticeboard;
