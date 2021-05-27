/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default async (_, res) => {
  res.clearPreviewData();

  res.writeHead(307, { Location: '/' });
  res.end();
};
