import Work from "../types/work";
import Link from "next/link";
import { useCollection, deleteDocument } from "@nandorojo/swr-firestore";
import { useUser } from "../lib/useUser";
import Linkify from "react-linkify";

const Works = () => {
  const collection = "okini-works";
  const { user } = useUser();
  const { data, error } = useCollection<Work>(collection, {
    where: ["userId", "==", user?.id],
    orderBy: ["createdAt", "asc"],
  });
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <section>
      <div className="md:flex md:items-center mb-6">
        <h3 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
          Works
        </h3>
        <p className="mb-8 md:text-5xl underline tracking-tighter m-5">
          <Link href="/works/new">
            <a>Add</a>
          </Link>
        </p>
      </div>
      <div className="grid">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((work) => (
              <tr key={work.id} className="border">
                <td className="px-4 py-2">
                  <span className="text-green-900 text-sm">
                    {work.name}({work.artistName})
                  </span>
                  <br />
                  <p>
                    <Linkify>{work.content}</Linkify>
                  </p>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/works/${work.id}`}>
                    <button className="btn btn-blue">Edit</button>
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="btn btn-red"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you wish to delete this item?"
                        )
                      )
                        deleteDocument(`${collection}/${work.id}`);
                    }}
                  >
                    Destroy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Works;
