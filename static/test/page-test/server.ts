import { Server } from 'http';
import * as express from 'express';
import * as path from 'path';

export const startServer = function () : Promise<Server> {
  return new Promise((resolve, reject) => {

    const app = express() as any;
    app.use('/build', express.static(path.join(__dirname, '../../../dist')));
    app.get('/', (req, res) => {
      res.status(200).sendFile(path.join(__dirname, '../page-test/html-page/forms.html'));
    });
    const server = app.listen(3000, () => {
      return resolve(server);
    });
  });
};
