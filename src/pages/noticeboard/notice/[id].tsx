import NextError from "next/error";
import { useRouter } from "next/router";
import { RouterOutputs, trpc } from "../../../utils/trpc";

type NoticeByIdOutput = RouterOutputs["notice"]["byId"];

const NoticeItem = (props: { notice: NoticeByIdOutput }) => {
  const { notice } = props;

  return (
    <>
      <h1>{notice.id}</h1>
      <em>Created {notice.createdAt.toLocaleDateString("en-us")}</em>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(notice, null, 4)}</pre>
    </>
  );
};

const NoticeViewPage = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.notice.byId.useQuery({ id });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== "success") {
    return <>Loading...</>;
  }

  const { data } = postQuery;
  return <NoticeItem notice={data} />;
};

export default NoticeViewPage;
