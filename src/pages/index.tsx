import { GetServerSideProps } from 'next';

const Home = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/characters',
      permanent: true,
    },
  };
};

export default Home;
