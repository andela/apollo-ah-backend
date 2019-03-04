import server from '../index';
import { env } from '../helpers/utils';
import logger from '../helpers/logger';

const port = env('PORT');
server.listen(port, () => logger.log(`Listening on port ${port}`));
