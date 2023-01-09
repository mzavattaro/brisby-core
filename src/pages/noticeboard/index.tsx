import { type NextPage } from "next";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

const Noticeboard: NextPage = () => {
  return (
    <div className="text-gray-900">
      <div>
        {/* <div className="relative">
          <Modal />
        </div> */}
        <Header />
      </div>
    </div>
  );
};

export default Noticeboard;
