import server from '../index';
import { env } from '../helpers/utils';
import logger from '../helpers/logger';

const port = env('PORT', 3000);
server.listen(port, () => logger.log(`We are live on port ${port}`));
