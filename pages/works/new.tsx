import Head from "next/head";
import Link from "next/link";
import { useCollection } from "@nandorojo/swr-firestore";
import * as firebase from "firebase/app";
import { useUser } from "../../lib/useUser";
import Container from "../../components/container";
import Layout from "../../components/layout";
import WorkForm from "../../components/work-form";
import Work from "../../types/work";

const New = () => {
  const { user } = useUser();
  const work: Work = {
    id: "",
    userId: "",
    name: "",
    content: "",
    artistName: "",
    collection: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { add } = useCollection(`okini-works`);
  const timestamp = () => firebase.firestore.FieldValue.serverTimestamp();

  if (!user) {
    return (
      <>
        <p>
          Please signed in.{" "}
          <Link href={"/auth"}>
            <a>Sign in</a>
          </Link>
        </p>
      </>
    );
  }

  function submit(
    name: string,
    content: string,
    artistName: string,
    collection: string
  ) {
    add({
      name: name,
      content: content,
      artistName: artistName,
      collection: collection,
      userId: user?.id,
      createdAt: timestamp(),
      updatdAt: timestamp(),
    });
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Okini</title>
        </Head>
        <Container>
          <WorkForm work={work} action={submit} />
        </Container>
      </Layout>
    </>
  );
};

export default New;
