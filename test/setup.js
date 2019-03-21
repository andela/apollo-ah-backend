import dotenv from 'dotenv';
import prepare from 'mocha-prepare';
import runAll from 'npm-run-all';

// preload ENV config for test environment
dotenv.config({ path: '.env.test' });

/**
 * Called before loading of test cases
 *
 * @param {Function} done - mocha async done method
 * @returns {void}
 */
const initSetup = (done) => {
  runAll(['migrate', 'seed'])
    .then(() => done())
    .catch(done);
};

/**
 * Called after all test completes (regardless of errors)
 *
 * @param {Function} done - mocha async done method
 * @returns {void}
 */
const tearDown = (done) => {
  runAll(['migrate:reset'])
    .then(() => done())
    .catch(done);
};

prepare(initSetup, tearDown);
