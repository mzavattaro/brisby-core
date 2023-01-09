import Home from "../../public/Home";
import Button from "../components/Button";

const Header = () => {
  return (
    <div className="mx-auto flex h-20 place-content-between items-center gap-y-0 border-b border-slate-200 bg-white px-6">
      <div className="flex">
        <Home />
        <h4 className="ml-2 text-lg font-bold">Kimberly Court</h4>
      </div>
      <div className="flex">
        <h4 className="mr-14">All</h4>
        <h4 className="mr-14">Published</h4>
        <h4 className="mr-14">Drafts</h4>
        <h4>Archived</h4>
      </div>
      <Button buttonSize="lg" buttonType="primary" type={"button"}>
        New notice
      </Button>
    </div>
  );
};

export default Header;
