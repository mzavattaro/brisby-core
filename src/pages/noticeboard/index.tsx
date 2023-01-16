import { type NextPage } from "next";
import Header from "../../components/Header";
import GridLayout from "../../components/GridLayout";
import NoticeItem from "../../components/NoticeItem";
import Modal from "../../components/Modal";
import { trpc } from "../../utils/trpc";

const Noticeboard: NextPage = () => {
  const { data } = trpc.notice.list.useQuery({});
  return (
    <div className="text-gray-900">
      {/* <div className="relative">
          <Modal />
        </div> */}
      <Header />
      <GridLayout>
        {data?.notices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} />
        ))}
      </GridLayout>
    </div>
  );
};

export default Noticeboard;
