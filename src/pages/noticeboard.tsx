import ToolBar from "../components/ToolBar";
import ColumnLayout from "../components/ColumnLayout";
import Header from "../components/Header";
import StackedList from "../components/StackedList";
import communityNotices from "../data/communityNotice";

export default function Noticeboard() {
  return (
    <div className="mx-auto max-w-screen-2xl text-gray-900">
      <div className="max-w-screen-2xl px-6">
        <Header />
        <ToolBar />
        <ColumnLayout>
          <StackedList communityNotices={communityNotices} />
        </ColumnLayout>
      </div>
    </div>
  );
}
