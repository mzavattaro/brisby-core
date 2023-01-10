import { type NextPage } from "next";
import GridLayout from "../../components/GridLayout";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

const Noticeboard: NextPage = () => {
  return (
    <div className="text-gray-900">
      {/* <div className="relative">
          <Modal />
        </div> */}
      <Header />
      <GridLayout />
    </div>
  );
};

export default Noticeboard;
