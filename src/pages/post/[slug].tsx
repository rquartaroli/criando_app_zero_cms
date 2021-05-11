import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// export default function Post() {
//   // TODO
// }

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(
  //   [Prismic.predicates.at('document.type', 'repeatable')],
  //   {
  //     fetch: ['repeatable.title', 'repeatable.subtitle', 'repeatable.author'],
  //     pageSize: 20,
  //   }
  // );

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('repeatable', String(slug), {});

  const post = {
    first_publication_date: new Date(
      response.last_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    data: [
      {
        title: RichText.asText(response.data.title),
        banner: {
          url: RichText.asText(response.data.banner),
        },
        author: RichText.asText(response.data.author),
        content: {
          heading: RichText.asText(response.data.heading),
          body: {
            text: RichText.asText(response.data.body),
          },
        },
      },
    ],
  };

  return {
    props: {
      post,
    },
  };
};
