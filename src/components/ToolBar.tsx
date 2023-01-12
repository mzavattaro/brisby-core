import Download from "../../public/Download";
import Draft from "../../public/Draft";
import Edit from "../../public/Edit";
import Publish from "../../public/Publish";
import Archive from "../../public/Archive";
import Delete from "../../public/Delete";

const tools = [
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
    <div className="mx-4 flex max-w-max divide-x divide-slate-200 overflow-auto rounded-md border bg-white py-2 shadow-xl sm:mx-auto">
      {tools.map((tool) => (
        <button key={tool.text} className="flex items-center px-4">
          <div className="mr-1">{tool.icon}</div>
          <span className="text-sm font-semibold text-gray-500">
            {tool.text}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ToolBar;
