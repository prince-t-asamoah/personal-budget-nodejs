/**
 * Base Data Transfer Object
 *
 */
class BaseDto {
  /**
   * Removes properties with undefined values from the instance
   */
  filterUndefined() {
    Object.keys(this).forEach(
      (key) => this[key] === undefined && delete this[key],
    );
  }
}

module.exports = BaseDto;
