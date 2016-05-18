/**
 * @module public/queue
 */

/**
 * Using the Bebop queue is the only way to interact with the
 * API. When Bebop loads the first thing it will do is load its
 * configuration by reading window.bebopConfig. The seconds
 * thing it will do is run all the functions stored in the queue.
 * It reads and executes function from begining to end the end of
 * the queue. It is safe, however unadvised to add functions to the
 * queue while it is being executed.
 *
 * @typedef {(Object|Array.<BebopQueueCallback>)} bebopQueue
 *
 * @property {function} push
 *
 * @example
 * window.bebopQueue = window.bebopQueue || [];
 * window.bebopQueue.push(function (bebop) {
 *      // do something with bebop
 * });
 */

/**
 * @callback BebopQueueCallback
 *
 * @param {Object} bebop - A reference the the Bebop API
 */
