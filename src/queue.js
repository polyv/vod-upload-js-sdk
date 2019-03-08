export class Queue {
  /**
   * 队列类。
   * @ignore
   */
  constructor() {
    this._list = [];
  }

  /**
   * 获取队列所有元素。
   * @returns {Array}
   */
  get list() {
    return this._list.slice();
  }


  /**
   * 获取队列长度。
   * @returns {Number}
   */
  get size() {
    return this._list.length;
  }


  /**
   * 添加元素到队列末尾。
   * @param {Object} item 队列元素
   */
  enqueue(item) {
    this._list.push(item);
  }

  /**
   * 添加元素到队列最前面。
   * @param {Object} item 队列元素
   */
  unshift(item) {
    this._list.push(item);
  }

  /**
   * 清空队列元素。
   */
  clear() {
    this._list = [];
  }

  /**
   * 删除队列中的第一个元素，并返回该元素。
   * @returns {Object}
   */
  dequeue() {
    return this._list.shift();
  }

  // 根据id找到元素在队列中的位置（index）。
  _findIndexById(id) {
    let chosenIndex = -1;
    const len = this.size;
    for (let i = 0; i < len; i++) {
      if (id === this._list[i].id) {
        chosenIndex = i;
        break;
      }
    }
    return chosenIndex;
  }

  /**
   * 查找指定元素。
   * @param {String} id 元素的唯一标识
   * @returns {(Object|null)}
   */
  find(id) {
    const chosenIndex = this._findIndexById(id);
    return chosenIndex > -1 ? this._list[chosenIndex] : null;
  }

  /**
   * 删除指定元素。
   * @param {String} id 元素的唯一标识
   * @returns {(Object|null)}
   */
  remove(id) {
    const chosenIndex = this._findIndexById(id);
    return chosenIndex > -1 ? this._list.splice(chosenIndex, 1)[0] : null;
  }
}
