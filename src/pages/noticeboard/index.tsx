import { type NextPage } from "next";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Modal from "../../components/Modal";

const noticeItem = [
  {
    id: "1",
    startDate: "January 30 2023",
    endDate: "December 22 2023",
    title:
      "Annual fire safety inspection notice for 123 Main Street is now available",
    noticeStatus: "Pubdivshed",
    author: "John Doe",
  },
];

const Noticeboard: NextPage = () => {
  return (
    <div className="text-gray-900">
      {/* <div className="relative">
          <Modal />
        </div> */}
      <Header />
      <GridLayout>
        <NoticeItem noticeItem={noticeItem} />
      </GridLayout>
    </div>
  );
};

export default Noticeboard;
