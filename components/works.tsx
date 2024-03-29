import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fuego, useCollection, deleteDocument } from "@nandorojo/swr-firestore";
import Linkify from "react-linkify";
import Work from "../types/work";
import { useUser } from "../lib/useUser";

const Works = () => {
  const collection = "okini-works";
  const limit = 50;
  const { user } = useUser();
  const [hasMore, setHashMore] = useState(true);
  const router = useRouter();
  const googleArtAndCultureURL = new URL(
    "search",
    "https://artsandculture.google.com/",
  );
  let condition = [["userId", "==", user?.id]] as any;
  let { artist } = router.query;

  if (artist?.length != 0 && typeof artist === "string") {
    condition.push(["artistName", "==", artist]);
  }

  const { data, error, mutate } = useCollection<Work>(
    collection,
    {
      where: condition,
      orderBy: ["createdAt", "desc"],
      limit: limit,
      ignoreFirestoreDocumentSnapshotField: false,
    },
    {
      // this lets us update the local cache + paginate without interruptions
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      refreshInterval: 0,
    },
  );

  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  if (!data) return <p>Loading...</p>;

  const paginate = async () => {
    if (!data?.length) return;

    const ref = fuego.db.collection(collection);

    // get the snapshot of last document we have right now in our query
    const startAfterDocument = data[data.length - 1].__snapshot;
    if (startAfterDocument === undefined) {
      setHashMore(false);
      return;
    }

    // get more documents, after the most recent one we have
    const moreDocs = await ref
      .where("userId", "==", user?.id)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .startAfter(startAfterDocument)
      .get()
      .then((d: any) => {
        const docs: any = [];
        d.docs.forEach((doc: any) => docs.push({ ...doc.data(), id: doc.id }));
        return docs;
      });

    if (moreDocs.length === 0) {
      setHashMore(false);
    }

    // mutate our local cache, adding the docs we just added
    // set revalidate to false to prevent SWR from revalidating on its own
    mutate((state) => [...(state as any), ...moreDocs], false);
  };

  const readMore = () => {
    if (!hasMore) {
      return "";
    }
    return <a onClick={paginate}>More Read</a>;
  };

  const buildSearchURL = (value: string): string => {
    const URL = googleArtAndCultureURL;
    URL.searchParams.set("q", value);
    return URL.toString();
  };

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
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((work) => (
              <tr key={work.id} className="border">
                <td className="px-4 py-2">
                  <span className="text-green-900">
                    {work.name} -
                    <Link href={`?artist=${work.artistName}`}>
                      <a> {work.artistName}</a>
                    </Link>
                  </span>
                  <br />
                  <p>
                    <Linkify>
                      <span className="text-sm">{work.content}</span>
                    </Linkify>
                  </p>
                  <span className="text-blue-900 text-sm">
                    {work.collection}
                  </span>
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
                          "Are you sure you wish to delete this item?",
                        )
                      )
                        deleteDocument(`${collection}/${work.id}`);
                    }}
                  >
                    Destroy
                  </button>
                </td>
                <td>
                  <div className="dropdown">
                    <div tabIndex={0} className="m-1 btn">
                      Search Google Arts
                    </div>
                    <ul
                      tabIndex={0}
                      className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a href={buildSearchURL(work.name)} target="blank">
                          Art Name
                        </a>
                      </li>
                      <li>
                        <a
                          href={buildSearchURL(work.artistName)}
                          target="blank"
                        >
                          Artist Name
                        </a>
                      </li>
                      <li>
                        <a
                          href={buildSearchURL(
                            `${work.name} ${work.artistName}`,
                          )}
                          target="blank"
                        >
                          Combine Names
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <p className="md:text-2xl underline tracking-tighter m-5">
          {readMore()}
        </p>
      </div>
    </section>
  );
};

export default Works;
