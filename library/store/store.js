const fs = require('fs/promises');
class Store {
  constructor() {
    this.db = [];
  }

  async createDB() {
    await fs.writeFile('db.json', JSON.stringify(this.db));
  }

  async readFromDB() {
    this.db = JSON.parse(await fs.readFile('db.json', 'utf-8'));
    return this.db;
  }

  async writeInDB(data) {
    this.db.push(data);
    await fs.writeFile('db.json', JSON.stringify(this.db));
  }

  async deleteFromDB(data) {
    this.db = data;
    await fs.writeFile('db.json', JSON.stringify(this.db));
  }
}

module.exports = new Store();
