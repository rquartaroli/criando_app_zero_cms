import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
// eslint-disable-next-line import/order
import { Head } from 'next/document';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>Desafio CMS</title>
      </Head>
      <div>
        {/* {postsPagination.results.map(post => (
          <h1>{post.data.title}</h1>
        ))} */}
        <main>
          <h1>Hello World</h1>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'repeatable')],
    {
      fetch: ['repeatable.title', 'repeatable.subtitle', 'repeatable.author'],
      pageSize: 20,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: [
        {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      ],
    };
  });

  return {
    props: { posts },
  };
};
