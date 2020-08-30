import Artist from "../types/artist";
import Link from "next/link";
import { useCollection, deleteDocument } from "@nandorojo/swr-firestore";
import { useUser } from "../lib/useUser";

const Artists = () => {
  const collection = "okini-artists";
  const { user } = useUser();
  const { data, error } = useCollection<Artist>(collection, {
    where: ["userId", "==", user?.id],
    // orderBy: ["createdAt", "asc"]
  });
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <section>
            <div className="md:flex md:items-center mb-6">
        <h3 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
          Artists
        </h3>
        <p className="mb-8 md:text-5xl underline tracking-tighter m-5">
          <Link href="/artists/new">
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
            </tr>
          </thead>
          <tbody>
            {data.map((artist) => (
              <tr key={artist.id}>
                <td>{artist.name}</td>
                <td>
                  <button
                    className="btn btn-red"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you wish to delete this item?"
                        )
                      )
                        deleteDocument(`${collection}/${artist.id}`);
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

export default Artists;
