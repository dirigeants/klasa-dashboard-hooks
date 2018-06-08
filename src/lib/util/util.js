class Util {

	/**
	 * This class may not be initiated with new
	 * @since 0.0.1-dev
	 * @throws {Error}
	 * @private
	 */
	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static toShard(expression, client, combine = false, force = false) {
		if (!expression) throw new Error('Please provide an expression');

		const { shard } = client;

		if (combine) {
			if (!shard) throw new Error('You cannot combine a non sharded expression');
			if (force) return expression;
			return shard.broadcastEval(expression).then(Util.arraySum);
		} else {
			if (!shard) return expression;
			return shard.broadcastEval(expression);
		}
	}

}

module.exports = Util;

/**
 * Add all the elements of the array
 * @since 0.0.1-dev
 * @param {Array} array The array
 * @returns {number} The sum
 */
Util.arraySum = array => array.reduce((partialSum, element) => partialSum + element, 0);
