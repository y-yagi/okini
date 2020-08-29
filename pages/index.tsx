import { useUser } from "../lib/useUser";
import Container from "../components/container";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Artists from "../components/artists";
import SectionSeparotr from "../components/section-separator";
import Head from "next/head";
import Link from "next/link";

const Index = () => {
  const { user, logout } = useUser();

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

  return (
    <>
      <Layout>
        <Head>
          <title>Okini</title>
        </Head>
        <Container>
          <Intro />
          <Artists />
          <SectionSeparotr />
        </Container>
      </Layout>
    </>
  );
};

export default Index;
