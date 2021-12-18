import Head from "next/head";
import FooterNav from "./FooterNav";

const PageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Kingdom Of Lunaris</title>
        <meta name="description" content="Lunaris homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-hidden">{children}</main>
      <footer>
        <FooterNav />
      </footer>
    </>
  );
};

export default PageLayout;
