import { useRouter } from "next/router";

const Application = () => {
  const router = useRouter();
  const { cityOrigin } = router.query;

  return (
    <div>
      <h1>{cityOrigin}</h1>
    </div>
  );
};

export default Application;
