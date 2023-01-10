import Download from "../../public/Download";
import Draft from "../../public/Draft";
import Edit from "../../public/Edit";
import Publish from "../../public/Publish";
import Archive from "../../public/Archive";
import Delete from "../../public/Delete";

const options = [
  {
    icon: <Edit />,
    text: "Edit",
  },
  {
    icon: <Download />,
    text: "Download",
  },
  {
    icon: <Publish />,
    text: "Publish",
  },
  {
    icon: <Draft />,
    text: "Draft",
  },
  {
    icon: <Archive />,
    text: "Archive",
  },
  {
    icon: <Delete />,
    text: "Delete",
  },
];

const ToolBar = () => {
  return (
    <div className="relative z-10 mx-auto flex w-fit rounded-md border bg-white py-2 shadow-lg">
      {options.map((option) => (
        <div className="flex items-center border-r px-4">
          <div className="mr-1">{option.icon}</div>
          <span className="text-gray-500">{option.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ToolBar;
